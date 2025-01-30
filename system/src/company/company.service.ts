import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompanyService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {

    const { users } = createCompanyDto;

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
    ].map((role) => {
      return {
        name: role,
        permissions: {
          create: permission
        },
      };
    });

    const usersToCreate = Array.isArray(users) 
        ? users 
        : [users];
    const processedUsers = await Promise.all(
      usersToCreate.map(async user => {
        return ({
          ...user,
          password: await bcrypt.hash(user.password, 10),
          admin: true,
          roles: {
            create: roles
          }
        })
      })
    );

    const data: Prisma.CompanyCreateInput = {
      ...createCompanyDto,
        users: {
          create: processedUsers
      }
    };

    const company = await this.prisma.company.findFirst({
      where: {
        OR: [
          {
            cnpj: createCompanyDto.cnpj
          },
          {
            cpf: createCompanyDto.cpf
          }
        ]
      }
    })

    const companyName = await this.prisma.company.findFirst({
      where: {
        name: createCompanyDto.name
      }
    })

    usersToCreate.map(async (user: any) => {

      const userExists =  await this.prisma.users.findUnique({
        where: { 
          email: user.email
        }
      })

      if (userExists){
        throw new ConflictException('E-mail existente!')
      }

    })

    if (companyName) {
      throw new ConflictException('Nome da empresa existente!')
    }

    if (company) {
      throw new ConflictException('CNPJ da empresa existente!')
    }

    return this.prisma.company.create({
      data,
      include: {
          users: true
      }
    });

  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
