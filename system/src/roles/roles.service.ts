/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildWhereClause } from 'src/utils/buildWhereClause';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto, userID: string) {
    const rolePermission = Array.isArray(createRoleDto.permissions)
      ? createRoleDto.permissions.map((role) => ({
          permission: role.permission,
        }))
      : [];

    const data: Prisma.RolesCreateInput = {
      ...createRoleDto,
      permissions: {
        create: rolePermission,
      },
      users: {
        connect: {
          id: userID,
        },
      },
    };

    const createRoles = await this.prisma.roles.create({ data });

    if (createRoles) {
      return {
        statusCode: 201,
        message: 'Função cadastrada',
        data: createRoles,
      };
    } else {
      throw new InternalServerErrorException(
        'Erro crítico, contate o suporte!',
      );
    }
  }

  findAll(
    filters: any,
    orderBy: Prisma.RolesOrderByWithAggregationInput,
    companyId: string
  ) {
    const { page = 1, perPage = 20, ...query } = filters;
    const paginate = createPaginator({ perPage: perPage });

    return paginate<
      CreateRoleDto,
      Prisma.RolesFindManyArgs
    >(
      this.prisma.roles,
      {
        where: buildWhereClause<Prisma.RolesWhereInput>(query, companyId),
        orderBy,
      },
      { page },
    );
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
