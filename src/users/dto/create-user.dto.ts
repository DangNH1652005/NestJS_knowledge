import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CreateProfileDto } from "src/profile/dto/create-profile.dto";

export class CreateUserDto {
    @IsNotEmpty()
    @MaxLength(24)
    username: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'password must be greater 8 character' })
    @MaxLength(100)
    password: string;

    @IsOptional()
    profile: CreateProfileDto; 
}



