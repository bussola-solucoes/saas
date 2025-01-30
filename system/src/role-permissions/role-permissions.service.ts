import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildWhereClause } from 'src/utils/buildWhereClause';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Injectable()
export class RolePermissionsService {

  constructor(private prisma: PrismaService) {}


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createRolePermissionDto: CreateRolePermissionDto) {
    return 'This action adds a new rolePermission';
  }

  findAll(
    filters: any,
    orderBy: Prisma.RolePermissionsOrderByWithAggregationInput,
    companyId: string
  ) {
    const { page = 1, perPage = 20, ...query } = filters;
    const paginate = createPaginator({ perPage: perPage });

    return paginate<
      CreateRolePermissionDto,
      Prisma.RolePermissionsFindManyArgs
    >(
      this.prisma.rolePermissions,
      {
        where: buildWhereClause<Prisma.RolePermissionsWhereInput>(query, companyId),
        orderBy,
      },
      { page },
    );
  }

  update(id: string, updateRolePermissionDto: UpdateRolePermissionDto) {
    return this.prisma.rolePermissions.update({
      where: { id },
      data: updateRolePermissionDto
    })
  };

  remove(id: number) {
    return `This action removes a #${id} rolePermission`;
  }
}
