import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProviderCredentialDto } from './dto/create-provider-credential.dto';
import { UpdateProviderCredentialDto } from './dto/update-provider-credential.dto';
import { EncryptionService } from 'src/auth/encryption.service';

@Injectable()
export class ProviderCredentialService {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService
  ) {}

  async create(data: CreateProviderCredentialDto, companyId: string) {
    const encryptedValue = this.encryptionService.encrypt(data.value);
    return this.prisma.providerCredential.create({
      data: {
        ...data,
        value: encryptedValue,
        companyId,
      },
    });
  }

  async findAll(providerId: string) {
    const credentials = await this.prisma.providerCredential.findMany({
      where: { providerId },
    });
    return credentials.map(cred => ({
      ...cred,
      value: this.encryptionService.decrypt(cred.value),
    }));
  }

  async findOne(id: string) {
    const credential = await this.prisma.providerCredential.findUnique({ where: { id } });
    if (credential) {
      credential.value = this.encryptionService.decrypt(credential.value);
    }
    return credential;
  }

  async update(id: string, data: UpdateProviderCredentialDto, companyId: string) {
    if (data.value) {
      data.value = this.encryptionService.encrypt(data.value);
    }
    return this.prisma.providerCredential.update({
      where: { id, companyId },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.providerCredential.delete({ where: { id } });
  }
}