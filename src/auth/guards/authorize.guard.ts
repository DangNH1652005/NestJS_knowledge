import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import authConfig from "../config/auth.config";

@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,

        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const token = request.headers.authorization?.split(' ')[1];

        if(!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, this.authConfiguration);
            request['user'] = payload;
            console.log(payload);
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }
}