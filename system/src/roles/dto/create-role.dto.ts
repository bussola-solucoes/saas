import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { Roles } from '../entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto extends Roles {
  @IsString({
    message: 'É necessário um nome para a função!',
  })
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @ApiProperty()
  permissions?: Prisma.RolePermissionsUncheckedCreateNestedManyWithoutRolesInput;
}
