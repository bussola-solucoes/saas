import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestBody } from './model/LoginRequestBody';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    async timeout (ms:number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    @Post('token')
    @HttpCode(HttpStatus.OK)
    async token(@Body() {email, password}:LoginRequestBody) {

        return await this.authService.token(email, password)
    }
}
