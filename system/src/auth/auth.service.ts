import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcrypt";
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { UserToken } from './model/UserToken';
import { UserPayload } from './model/UserPayload';


@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async login(email: string, password: string): Promise<UserToken> {
        
        const user = await this.validateUser(email, password);

        const payload: UserPayload = {
            email: user.email,
            sub: user.id,
            companyId: user.companyId
        }

        const accessToken = this.jwtService.sign(payload);        

        return { accessToken };

    }
    
    private async validateUser(email: string, password: string) {

        const user = await this.userService.findByEmailLogin(email);

        if (user) {
            
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                return {
                    ...user
                }
            } else {
                throw new UnauthorizedError (
                    'Email e/ou senha incorreta!'
                )
            }
        
        } else {
            throw new UnauthorizedError (
                'Email e/ou senha incorreta!'
            )
        }
    }
}
