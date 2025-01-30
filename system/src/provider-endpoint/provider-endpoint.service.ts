import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProviderEndpointDto } from './dto/create-provider-endpoint.dto';
import { UpdateProviderEndpointDto } from './dto/update-provider-endpoint.dto';

@Injectable()
export class ProviderEndpointService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProviderEndpointDto) {
    return this.prisma.providerEndpoint.create({
      data: {
        ...data
      }
    });
  }

  async findAll() {
    return this.prisma.providerEndpoint.findMany();
  }

  async findOne(id: string) {
    return this.prisma.providerEndpoint.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateProviderEndpointDto) {
    return this.prisma.providerEndpoint.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.providerEndpoint.delete({ where: { id } });
  }
}
