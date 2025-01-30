import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Headers,
  Query,
  Req,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  StreamableFile,
  UseInterceptors,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as jwt from 'jsonwebtoken';
import { ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import DecryptToken from 'src/utils/decryptToken';
import { FileService } from 'src/file/file.service';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { QueryTransformPipe } from 'src/utils/queryTransformPipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer.config';
//import { RolePermissions } from 'src/role-permissions/entities/role-permission.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {}

  @Roles('Users', 'insert')
  @Post()
  async create(@Body() createUser: CreateUser, @Req() req) {
    return this.userService.createUser({
      ...createUser,
      createdBy: req?.user?.id,
      updatedBy: req?.user?.id,
    });
  }

  @Roles('all')
  @Post('informations')
  async getUser(@Headers() token) {
    const tokenNoBearer = token?.authorization?.replace('Bearer ', '');
    const decoded = jwt.verify(tokenNoBearer, process.env.JWT_SECRET);
    const email = Object(decoded).email;

    return this.userService.findByUserRoles(email);
  }

  @Roles('Users', 'views')
  @Get()
  @ApiQuery({ name: 'query', required: false })
  async findAll(@Headers() token, @Query(QueryTransformPipe) query?: any) {
    const { companyId } = await DecryptToken(token);
    const { orderBy, ...rest } = query;
    return this.userService.findAll(rest, orderBy, companyId);
  }

  @Roles('Users', 'views')
  @Get('email')
  async findByEmail(@Headers() token) {
    const { email } = await DecryptToken(token);

    return this.userService.findByEmail(email);
  }

  @Roles('Users', 'views')
  @Get(':email')
  async findByEmailLogin(@Param('email') email: string) {
    return this.userService.findByEmailLogin(email);
  }

  @Roles('Users', 'views')
  @Get('id')
  async findById(@Headers() token) {

    const { id } = await DecryptToken(token);

    return this.userService.findById(id);
  }

  @Roles('Users', 'views')
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async uploadFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('Nenhum arquivo recebido');
    }

    const fileName = await this.fileService.saveFile(file);
    const avatarPath = `avatars/${fileName}`;
    
    const user = await this.userService.updateAvatar(id, avatarPath);

    return {
        message: 'Avatar updated successfully',
        avatarPath,
        user
    };
  }

  @Get('avatar/url')
  async getAvatar(
    @Headers() token,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    const { id } = await DecryptToken(token)
    const user = await this.userService.findById(id);
    if (!user || !user.avatar) {
      throw new NotFoundException('Avatar not found');
    }

    const filePath = join(process.cwd(), 'uploads', user.avatar);
    
    try {
      const file = createReadStream(filePath);
      
      const ext = user.avatar.split('.').pop().toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === 'png') contentType = 'image/png';
      else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
      else if (ext === 'gif') contentType = 'image/gif';

      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${user.avatar}"`,
      });

      return new StreamableFile(file);
    } catch (error) {
      throw new NotFoundException('Avatar file not found');
    }
  }

  @Roles('Users', 'update')
  @Patch(':id')
  async updateNameEmail(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.userService.updateNameEmail(id, {
      ...updateUserDto,
      updatedBy: req?.user.id,
    });
  }

  @Roles('all')
  @Patch('password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.userService.updatePassword(id, updateUserDto, req?.user?.id);
  }

  @Roles('Users', 'update')
  @Patch('restore/:id')
  async restore(@Param('id') id: string, @Headers() token) {
    const tokenNoBearer = token?.authorization?.replace('Bearer ', '');
    const decoded = jwt.verify(tokenNoBearer, process.env.JWT_SECRET);
    const idToken = Object(decoded).sub;

    return this.userService.restore(id, idToken);
  }

  @Roles('Users', 'delete')
  @Patch('remove/:id')
  async remove(@Param('id') id: string, @Headers() token) {
    const tokenNoBearer = token?.authorization?.replace('Bearer ', '');
    const decoded = jwt.verify(tokenNoBearer, process.env.JWT_SECRET);
    const idToken = Object(decoded).sub;

    return this.userService.remove(id, idToken);
  }
}
