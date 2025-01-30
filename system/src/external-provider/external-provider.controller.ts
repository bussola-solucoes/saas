import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { ExternalProviderService } from './external-provider.service';
import { CreateExternalProviderDto } from './dto/create-external-provider.dto';
import { UpdateExternalProviderDto } from './dto/update-external-provider.dto';
import DecryptToken from 'src/utils/decryptToken';
import { Roles } from 'src/auth/roles.decorator';

@Controller('external-provider')
export class ExternalProviderController {
  constructor(private readonly externalProviderService: ExternalProviderService) {}

  @Roles('Integration', 'insert')
  @Post()
  async create(
    @Body() createExternalProviderDto: CreateExternalProviderDto,
  ) {
    return this.externalProviderService.create(createExternalProviderDto);
  }

  @Get()
  findAll() {
    return this.externalProviderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.externalProviderService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateExternalProviderDto: UpdateExternalProviderDto,
  ) {
    return this.externalProviderService.update(id, updateExternalProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.externalProviderService.remove(id);
  }
}
