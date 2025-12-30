import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException, RequestTimeoutException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { Profile } from "src/profile/profile.entity";
import { ConfigService } from "@nestjs/config";
import { UserAlreadyExistsException } from "src/exceptions/user-already-exists.exceoption";
import { Paginated } from "src/common/pagination/paginater.interface";
import { PaginationProvider } from "src/common/pagination/pagination.provider";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import { HashingProvider } from "src/auth/provider/hashing.provider";

@Injectable()   // Dependency Injection
export class UsersService {
    constructor (
        @InjectRepository(User)
        private userRepository: Repository<User>,
        
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,

        private readonly configService: ConfigService,
    
        private readonly paginationProvider: PaginationProvider,

        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider

    ) {}

    public async getAllUsers(paginationQueryDto: PaginationQueryDto): Promise<Paginated<User>> {
        try {
            // const enviroment = this.configService.get<string>('ENV_MODE');
            // console.log(enviroment);
            
            // const nodeENV = process.env.NODE_ENV;
            // console.log(nodeENV);
            return this.paginationProvider.paginateQuery(
                paginationQueryDto,
                this.userRepository,
                null,
                ['profile']
            )

            // return await this.userRepository.find({
            //     relations: {    // Eager Loading
            //         profile: true
            //     }
            // });
        } catch (error) {
            throw new RequestTimeoutException(
                'An error has occured. Please try again later', 
                { description: 'Could not connect to database' }
            )
        }
    }


    public async createUser(userDto: CreateUserDto) {
        try {
            // Create a Profile and save
            userDto.profile = userDto.profile ?? {};
            // let profile = this.profileRepository.create(userDto.profile);
            // await this.profileRepository.save(profile);

            const existingUserWithUsername = await this.userRepository.findOne({
                where: [{ username: userDto.username }]
            });

            if(existingUserWithUsername) {
                throw new UserAlreadyExistsException('username', userDto.username);
            }

            const existingUserWithEmail = await this.userRepository.findOne({
                where: [{ email: userDto.email }]
            });

            if(existingUserWithEmail) {
                throw new UserAlreadyExistsException('email', userDto.email);
            }

            // Create user object
            let user = this.userRepository.create({
                ...userDto,
                password: await this.hashingProvider.hashPassword(userDto.password)
            });

            // Set the profile
            // user.profile = profile;

            // Save User
            return await this.userRepository.save(user);
        } catch (error) {
            if(error.code === 'ECONNREFUSED') { // Handling Exception Conditionally
                throw new RequestTimeoutException(
                    'An error has occured. Please try again later', 
                    { description: 'Could not connect to database' }
                );
            }

            // if(error.code === '23505') {
            //     throw new BadRequestException('There is fome dulicate value for the user in Database');
            // }

            throw error;
        }
        
        
    }

    public async deleteUser(id: number) {
        await this.userRepository.delete(id);

        return { deleted: true };
    }

    public async findUserById(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if(!user) {
            throw new HttpException({   // Custom Exception using HttpException
                status: HttpStatus.NOT_FOUND,
                error: `the user with ID ${id} was not found`,
                table: 'user'
            }, HttpStatus.NOT_FOUND, {
                description: `The exception occured because a user with ${id} was not found in users`
            })
        }

        return user;
        
    }

    public async findUserByUsername(username: string) {
        let user: User | null = null;

        try {
            user = await this.userRepository.findOneBy({
                username
            });
        } catch(error) {
            throw new RequestTimeoutException(error, {
                description: 'User with given username cound not be found!'
            });
        }

        if(!user) {
            throw new UnauthorizedException('User does not exist!!');
        }

        return user;
    }
}