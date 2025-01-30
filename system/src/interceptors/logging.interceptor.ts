import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ConflictException, BadRequestException, NotFoundException, ForbiddenException, InternalServerErrorException, BadGatewayException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const resp = context.switchToHttp().getResponse();
    const { method, url, body, headers } = request;
    const token = headers.authorization?.split(' ')[1] || 'No Token Provided';
    const now = Date.now();

    // if (token == 'No Token Provided' && url !== '/login') {
    //     throw new UnauthorizedException()
    // }
    
    if ((url !== '/login') && (!String(url).includes('audit-log'))) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const companyID = Object(decoded).companyID;
        const userId = Object(decoded).sub;
        const email = Object(decoded).email;

        return next.handle().pipe(
            tap(async (response) => {
                const responseTime = Date.now() - now;

                // Armazena o log no banco de dados
                await this.prisma.auditLog.create({
                    data: {
                        method,
                        url,
                        body: JSON.stringify(body),
                        responseTime,
                        users: {
                          connect: {
                              id: userId
                          }
                        },
                        email,
                        response: JSON.stringify(response),
                        message: response.message !== undefined ? response.message : '',
                        statusCode: resp.statusCode
                    },
                });
            }),
            catchError(async (error) => {
                const responseTime = Date.now() - now;                
                // Armazena o log no banco de dados
                await this.prisma.auditLog.create({
                    data: {
                        method,
                        url,
                        body: JSON.stringify(body),
                        responseTime,
                        users: {
                          connect: {
                              id: userId
                          }
                        },
                        email,
                        response: JSON.stringify(error),
                        message: error.message,
                        statusCode: error.status ? error.status : 500,
                    },
                });

                if (error.status == 400) {
                    throw new BadRequestException(String(error?.response?.message))
                }

                if (error.status == 401) {
                    throw new UnauthorizedException(String(error?.response?.message),)
                }

                if (error.status == 403) {
                    throw new ForbiddenException(String(error?.response?.message),)
                }

                if (error.status == 404) {
                    throw new NotFoundException(String(error?.response?.message),)
                }

                if (error.status == 409) {
                    throw new ConflictException(String(error?.response?.message),)
                }

                if (error.status == 500 || error) {
                    throw new InternalServerErrorException(String(error?.response?.message ? error?.response?.message : String(error)))
                }

                if (error.status == 502) {
                    throw new BadGatewayException(String(error?.response?.message),)
                }
            })
        );
        
    } 
    else if (url == "/login") {
        return next.handle().pipe(
            tap(async (response) => {
                const responseTime = Date.now() - now;

                // Armazena o log no banco de dados
                await this.prisma.auditLog.create({
                    data: {
                        method,
                        url,
                        body: body.email,
                        responseTime,
                        userId: null,
                        email: body.email,
                        response: url == "/login" ? response.accessToken : response.data.name,
                        message: url == "/login" ? 'Conectado com sucesso' : "Empresa criada com sucesso",
                        statusCode: resp.statusCode,
                    },
                });
            }),
            catchError(async (error) => {
                const responseTime = Date.now() - now;
                // Armazena o log no banco de dados
                await this.prisma.auditLog.create({
                    data: {
                        method,
                        url,
                        body: body.email,
                        responseTime,
                        userId: null,
                        email: body.email,
                        response: JSON.stringify(error.response),
                        message: String(error.response.message),
                        statusCode: error.response.statusCode,
                    },
                });

                if (error.response.statusCode == 400) {
                    throw new BadRequestException(String(error.response.message))
                }

                if (error.response.statusCode == 401) {
                    throw new UnauthorizedException(String(error.response.message),)
                }

                if (error.response.statusCode == 403) {
                    throw new ForbiddenException(String(error.response.message),)
                }

                if (error.response.statusCode == 404) {
                    throw new NotFoundException(String(error.response.message),)
                }

                if (error.response.statusCode == 409) {
                    throw new ConflictException(String(error.response.message),)
                }

                if (error.response.statusCode == 500) {
                    throw new InternalServerErrorException(String(error.response.message))
                }

                if (error.response.statusCode == 502) {
                    throw new BadGatewayException(String(error.response.message),)
                }

            })
        );
    }    
  }
}
