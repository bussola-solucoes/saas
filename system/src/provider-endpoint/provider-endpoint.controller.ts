import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { ProviderEndpointService } from './provider-endpoint.service';
import { CreateProviderEndpointDto } from './dto/create-provider-endpoint.dto';
import { UpdateProviderEndpointDto } from './dto/update-provider-endpoint.dto';
import DecryptToken from 'src/utils/decryptToken';

@Controller('provider-endpoint')
export class ProviderEndpointController {
  constructor(private readonly providerEndpointService: ProviderEndpointService) {}

  @Post()
  async create(
    @Body() createProviderEndpointDto: CreateProviderEndpointDto,
    @Headers() token: any
  ) {
    return this.providerEndpointService.create(createProviderEndpointDto);
  }

  @Get()
  async findAll(
    @Headers() token: any
  ) {
    return this.providerEndpointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providerEndpointService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateProviderEndpointDto: UpdateProviderEndpointDto,
    @Headers() token: any
  ) {
    return this.providerEndpointService.update(id, updateProviderEndpointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providerEndpointService.remove(id);
  }
}
