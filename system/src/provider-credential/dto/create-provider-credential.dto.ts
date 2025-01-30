import { CredentialType } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsUUID, IsBoolean, IsDate } from 'class-validator';

export class CreateProviderCredentialDto {
  @IsEnum(CredentialType)
  type: CredentialType;

  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;

  @IsUUID()
  providerId: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;
}