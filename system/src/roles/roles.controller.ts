import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import * as jwt from 'jsonwebtoken';
import { Roles } from 'src/auth/roles.decorator';
import DecryptToken from 'src/utils/decryptToken';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Roles('Roles', 'insert')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @Headers() token) {

    const tokenNoBearer = token.authorization.replace('Bearer ', '');
    const decoded = jwt.verify(tokenNoBearer, process.env.JWT_SECRET);
    const userID = Object(decoded).sub;

    return this.rolesService.create(createRoleDto, userID);
  }

  @Roles('Roles', 'views')
  @Get()
  async findAll(@Headers() token, @Query() query: any) {
    const { companyId } = await DecryptToken(token);
    const { orderBy, ...rest } = query;
    return this.rolesService.findAll(rest, orderBy, companyId);
  }

  @Roles('Roles', 'update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Roles('Roles', 'delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
