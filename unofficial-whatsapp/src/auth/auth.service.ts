import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { UserToken } from './model/UserToken';
import { UserPayload } from './model/UserPayload';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) {}

    async token(email: string, password: string): Promise<UserToken> {
        
        const user = await this.validateUser(email, password);

        const payload: UserPayload = {
            email: user.email,
            sub: user.id,
            companyId: user.companyId
        }

        const token = this.jwtService.sign(payload);        

        return { token };

    }
    
    private async validateUser(email: string, password: string) {

        const user = await this.prisma.users.findUnique({
            where: { email: email, disable: false },
            include: {
              roles: {
                include: {
                  permissions: true
                }
              }
            },
        });

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
