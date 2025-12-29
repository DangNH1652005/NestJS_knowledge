
import { IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProfileDto {

    @IsString({ message: 'First Name should be a string value' })
    @IsNotEmpty()
    @MinLength(3, { message: 'Last Name should have a minimum of 3 character.' })
    @MaxLength(100)
    @IsOptional()
    firstName?: string;

    @IsString({ message: 'Name should be a string value' })
    @IsNotEmpty()
    @MinLength(3, { message: 'Name should have a minimum of 3 character.' })
    @MaxLength(100)
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    @IsOptional()
    gender?: string;

    @IsOptional()
    @IsDate()
    dateOfBirth?: Date;

    @IsString()
    @IsOptional()
    bio: string;

    @IsString()
    @IsOptional()
    profileImg: string;
}

