import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable, of } from 'rxjs';
import { map, mergeMap, takeWhile, tap } from 'rxjs/operators';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): Observable<boolean> | boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const canActivate = super.canActivate(context);

    if (typeof canActivate === 'boolean') {
      return canActivate;
    }

    return of(canActivate).pipe(
      mergeMap((value) => value),
      takeWhile((value) => value),
      map(() => context.switchToHttp().getRequest()),
      mergeMap((request) =>
        of(request).pipe(
          map((req) => {

            if (!req.user) {
              throw new UnauthorizedException(
                'Usuário não encontrado na requisição.',
              );
            }
            return req.user;
          }),
          mergeMap((userFromJwt: any) =>
            this.prisma.users.findUnique({
              where: { email: userFromJwt.email, disable: false },
              include: {
                roles: {
                  include: {
                    permissions: true
                  }
                }
              },
            })
          ),
          tap((user) => {
            request.principalRoles = user;
          }),
          mergeMap((user) => {
            if (user?.admin) {
              return of(true); // Se for admin, concede acesso a tudo
            }

            const requiredRoles = this.reflector.getAllAndOverride<string[]>(
              ROLES_KEY,
              [context.getHandler(), context.getClass()],
            );

            if (requiredRoles[0] == 'all') {
              return of(true);
            }

            if (!requiredRoles || requiredRoles.length === 0) {
              throw new UnauthorizedException(
                'You do not have permission to access the route.',
              );
            }

            const userRoles = user.roles.filter((role) => role.name == requiredRoles[0]);

            const hasRole = userRoles[0]?.permissions?.filter((value) => value.permission.includes(requiredRoles[1]));

            if (hasRole[0].active == false && hasRole[0].permission == 'views') {
              throw new UnauthorizedException(
                'You do not have permission to access the view route.',
              );
            }

            if (hasRole[0].active == false && hasRole[0].permission == 'insert') {
              throw new UnauthorizedException(
                'You do not have permission to access the create route.',
              );
            }

            if (hasRole[0].active == false && hasRole[0].permission == 'update') {
              throw new UnauthorizedException(
                'You do not have permission to access the update route.',
              );
            }

            if (hasRole[0].active == false && hasRole[0].permission == 'delete') {
              throw new UnauthorizedException(
                'You do not have permission to access the delete route.',
              );
            }

            return of(true);
          }),
        ),
      ),
    );
  }
}
