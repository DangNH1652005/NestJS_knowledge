import { forwardRef, Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) 
        private readonly userService: UsersService,
        
        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>
    ) {

    }

    isAuthenticaled: Boolean = false;

    login(email: string, pswd: string) {
        console.log(this.authConfiguration.sharedSecret);
        return 'You logined'
    }    
}
