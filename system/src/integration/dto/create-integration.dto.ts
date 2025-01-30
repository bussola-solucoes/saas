import { IntegrationStatus } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsUUID, IsJSON } from 'class-validator';

export class CreateIntegrationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(IntegrationStatus)
  status?: IntegrationStatus;

  @IsOptional()
  @IsJSON()
  settings?: string;

  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @IsUUID()
  providerId: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;
}
