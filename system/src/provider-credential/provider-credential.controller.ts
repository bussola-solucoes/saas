import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { ProviderCredentialService } from './provider-credential.service';
import { CreateProviderCredentialDto } from './dto/create-provider-credential.dto';
import { UpdateProviderCredentialDto } from './dto/update-provider-credential.dto';
import DecryptToken from 'src/utils/decryptToken';

@Controller('provider-credential')
export class ProviderCredentialController {
  constructor(private readonly providerCredentialService: ProviderCredentialService) {}

  @Post()
  async create(
    @Body() createProviderCredentialDto: CreateProviderCredentialDto,
    @Headers() token: any
  ) {
    const { companyId } = await DecryptToken(token);
    return this.providerCredentialService.create(createProviderCredentialDto, companyId);
  }

  @Get()
  async findAll(
    @Headers() token: any
  ) {
    const { companyId } = await DecryptToken(token);
    return this.providerCredentialService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providerCredentialService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateProviderCredentialDto: UpdateProviderCredentialDto,
    @Headers() token: any
  ) {
    const { companyId } = await DecryptToken(token);
    return this.providerCredentialService.update(id, updateProviderCredentialDto, companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providerCredentialService.remove(id);
  }
}
