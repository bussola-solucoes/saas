import { Module } from '@nestjs/common';
import { ProviderCredentialService } from './provider-credential.service';
import { ProviderCredentialController } from './provider-credential.controller';
import { EncryptionService } from 'src/auth/encryption.service';

@Module({
  controllers: [ProviderCredentialController],
  providers: [ProviderCredentialService, EncryptionService],
})
export class ProviderCredentialModule {}
