import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { DataMappingService } from './data-mapping.service';
import { CreateDataMappingDto } from './dto/create-data-mapping.dto';
import { UpdateDataMappingDto } from './dto/update-data-mapping.dto';
import DecryptToken from 'src/utils/decryptToken';

@Controller('data-mapping')
export class DataMappingController {
  constructor(private readonly dataMappingService: DataMappingService) {}

  @Post()
  async create(
    @Body() createDataMappingDto: CreateDataMappingDto,
  ) {
    return this.dataMappingService.create(createDataMappingDto);
  }

  @Get()
  async findAll(
  ) {
    return this.dataMappingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataMappingService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDataMappingDto: UpdateDataMappingDto,
  ) {
    return this.dataMappingService.update(id, updateDataMappingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataMappingService.remove(id);
  }
}
