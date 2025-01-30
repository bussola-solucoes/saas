import { Injectable } from '@nestjs/common';
import { CreateDataMappingDto } from './dto/create-data-mapping.dto';
import { UpdateDataMappingDto } from './dto/update-data-mapping.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DataMappingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDataMappingDto) {
    return this.prisma.dataMapping.createMany({
      data
    });
  }

  async findAll() {
    return this.prisma.dataMapping.findMany();
  }

  async findOne(id: string) {
    return this.prisma.dataMapping.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateDataMappingDto) {
    return this.prisma.dataMapping.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.dataMapping.delete({ where: { id } });
  }
}
