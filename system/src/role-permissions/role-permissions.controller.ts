import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { Roles } from 'src/auth/roles.decorator';
import DecryptToken from 'src/utils/decryptToken';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @Roles('Roles', 'insert')
  @Post()
  create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return this.rolePermissionsService.create(createRolePermissionDto);
  }

  @Roles('Roles', 'views')
  @Get()
  async findAll(@Headers() token, @Query() query: any) {
    const { companyId } = await DecryptToken(token);
    const { orderBy, ...rest } = query;
    return this.rolePermissionsService.findAll(rest, orderBy, companyId);
  }

  @Roles('Roles', 'update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolePermissionDto: UpdateRolePermissionDto) {
    return this.rolePermissionsService.update(id, updateRolePermissionDto);
  }

  @Roles('Roles', 'delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolePermissionsService.remove(+id);
  }
}
