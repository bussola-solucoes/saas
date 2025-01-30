import { PartialType } from '@nestjs/swagger';
import { CreateProviderCredentialDto } from './create-provider-credential.dto';

export class UpdateProviderCredentialDto extends PartialType(CreateProviderCredentialDto) {}
