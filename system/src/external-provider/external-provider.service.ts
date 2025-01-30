import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExternalProviderDto } from './dto/create-external-provider.dto';
import { UpdateExternalProviderDto } from './dto/update-external-provider.dto';

@Injectable()
export class ExternalProviderService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateExternalProviderDto) {
    return this.prisma.externalProvider.create({ 
      data
    });
  }

  async findAll() {
    return this.prisma.externalProvider.findMany();
  }

  async findOne(id: string) {
    return this.prisma.externalProvider.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateExternalProviderDto) {
    return this.prisma.externalProvider.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.externalProvider.delete({ where: { id } });
  }
}