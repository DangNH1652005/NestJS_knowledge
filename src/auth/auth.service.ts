import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) 
        private readonly userService: UsersService,
        
        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,

        private readonly hashingProvider: HashingProvider,

        private readonly jwtService: JwtService
    ) {

    }

    isAuthenticaled: Boolean = false;

    public async login(loginDto: LoginDto) {
        let user = await this.userService.findUserByUsername(loginDto.username);
        let isEqual: boolean = false;

        isEqual = await this.hashingProvider.comparePassword(loginDto.password, user.password);
    
        if(!isEqual) {
            throw new UnauthorizedException('Incorrect password');
        }

        const token = await this.jwtService.signAsync({
            sub: user.id,  
            email: user.email
        }, {
            secret: this.authConfiguration.secret,
            expiresIn: this.authConfiguration.expiresIn,
            audience: this.authConfiguration.audience,
            issuer: this.authConfiguration.issuer
        });

        return {
            token: token,
            data: user,
            success: true,
            message: 'User logged in successfully'
        }
    }    

    public async signup(createUserDto: CreateUserDto) {
        return await this.userService.createUser(createUserDto);
    }
}
