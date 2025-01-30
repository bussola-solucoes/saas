import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, $Enums } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { buildWhereClause } from 'src/utils/buildWhereClause';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUser: Prisma.UsersCreateInput) {

    const permissions = $Enums.Permissions;

    const permission = [
      {
        permission: permissions.views,
      },
      {
        permission: permissions.insert,
      },
      {
        permission: permissions.update,
      },
      {
        permission: permissions.delete,
      },
    ]

    const roles = [
      'Message Order Status',
      'Order Status',
      'Users',
      'Roles',
      'Log',
      'SAP'
    ].map((role) => {
      return {
        name: role,
        permissions: {
          create: permission
        },
      };
    });

    const data: Prisma.UsersCreateInput = {
      ...createUser,
      password: await bcrypt.hash(createUser.password, 16),
      roles: {
        create: roles,
      },
    };

    const { email } = data;

    const userExists = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new ConflictException('E-mail existente!');
    }

    const createUsers = await this.prisma.users.create({ data });

    if (createUsers) {
      return {
        statusCode: 201,
        message: 'Usuário cadastrado com sucesso!',
        data: {
          name: createUsers.name,
          email: createUsers.email,
          roles: roles,
        },
      };
    } else {
      throw new InternalServerErrorException(
        'Erro crítico, contate o suporte!',
      );
    }
  }

  findAll(
    filters: any, 
    orderBy: Prisma.UsersOrderByWithAggregationInput,
    companyId: string
  ) {
    const { page = 1, perPage = 20, ...query } = filters;
    const paginate = createPaginator({ perPage: perPage });
    return paginate<CreateUser, Prisma.UsersFindManyArgs>(
      this.prisma.users,
      {
        where: buildWhereClause<Prisma.UsersWhereInput>(query, companyId),
        orderBy,
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          disable: true,
          admin: true,
          avatar: true,
          changePasswordAtNextLogon: true
        }
      },
      { page },
    );
  }

  async findByEmailLogin(email: string) {
    return await this.prisma.users.findUnique({
      where: { email: email, disable: false },
      include: {
        roles: {
          include: {
            permissions: true
          }
        }
      },
    });
  }

  async findByUserRoles(email: string) {
    return await this.prisma.users.findUnique({
      where: { email: email, disable: false },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        admin: true,
        changePasswordAtNextLogon: true,
        roles: {
          include: {
            permissions: true
          }
        }
      }
    })
  }

  async findByEmail(email: string) {
    const findByEmails = await this.prisma.users.findUnique({
      where: { email, disable: false },
    });

    if (!findByEmails) {
      throw new ConflictException('E-mail não existe!');
    }

    const user = this.prisma.users.findUnique({
      where: { email, disable: false },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        avatar: true,
        disable: true,
        admin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findById(id: string) {
    const findId = await this.prisma.users.findUnique({
      where: { id, disable: false },
    });

    if (!findId) {
      throw new ConflictException('Usuário não encontrado!');
    }

    const user = this.prisma.users.findUnique({
      where: { id, disable: false },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        avatar: true,
        disable: true,
        admin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getUserRoles(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        roles: true, // Incluir as roles associadas ao usuário
      },
    });
    return user.roles;
  }

  async updateNameEmail(
    idToken: string,
    updateUserDto: Prisma.UsersUpdateInput,
  ) {
    const findByIdToken = await this.prisma.users.findUnique({
      where: { id: idToken },
    });

    if (!findByIdToken) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    const user = await this.prisma.users.update({
      where: { id: idToken },
      data: updateUserDto,
    });

    return {
      message: `Usuário ${findByIdToken?.email} alterado com sucesso`,
      status: 204,
      data: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        admin: user.admin,
        disable: user.disable,
      },
    };
  }

  async updatePassword(
    idToken: string,
    updateUserDto: UpdateUserDto,
    updatedBy: string,
  ) {
    const findByIdToken = await this.prisma.users.findUnique({
      where: { id: idToken, disable: false },
    });

    if (!findByIdToken) {
      throw new ConflictException('Usuário não encontrado!');
    }

    await this.prisma.users.update({
      where: { id: idToken, disable: false },
      data: {
        password: await bcrypt.hash(updateUserDto.password, 16),
        changePasswordAtNextLogon: false,
        updatedBy: updatedBy,
      },
    });

    return {
      message: `Senha alterada com sucesso`,
      status: 204,
    };
  }

  async updateAvatar(id: string, avatarPath: string) {
    const user = await this.prisma.users.findUnique({
        where: { id }
    });

    if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.users.update({
        where: { id },
        data: {
            avatar: avatarPath,
            updatedAt: new Date()
        }
    }); 
  }

  async restore(id: string, idToken: string) {
    const userRestoreStatus = await this.prisma.users.findUnique({
      where: { id: id, disable: false },
    });

    const userRestore = await this.prisma.users.findUnique({ where: { id } });

    const userAdmin = await this.prisma.users.findUnique({
      where: { id: idToken, disable: false, admin: false },
    });

    if (userAdmin) {
      throw new ConflictException('Usuário solicitante não é administrador!');
    }

    if (userRestoreStatus) {
      throw new ConflictException('Usuário encontra-se ativo!');
    }

    await this.prisma.users.update({
      where: { id: id, disable: true },
      data: { disable: false },
    });

    return {
      message: `Usuário ${userRestore?.email} restaurado com sucesso`,
      status: 204,
    };
  }

  async remove(id: string, idToken: string) {
    const userRemoveStatus = await this.prisma.users.findUnique({
      where: { id: id, disable: true },
    });

    const userRemove = await this.prisma.users.findUnique({ where: { id } });

    const userAdmin = await this.prisma.users.findUnique({
      where: { id: idToken, disable: false, admin: false },
    });

    if (userAdmin) {
      throw new ConflictException('Usuário solicitante não é administrador!');
    }

    if (userRemoveStatus) {
      throw new ConflictException('Usuário encontra-se inativo!');
    }

    await this.prisma.users.update({
      where: { id, disable: false },
      data: { disable: true },
    });

    return {
      message: `Usuário ${userRemove.email} removido com sucesso`,
      status: 204,
    };
  }
}
