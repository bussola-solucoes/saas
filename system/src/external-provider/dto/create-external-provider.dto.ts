import { ProviderStatus } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export class CreateExternalProviderDto {
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsString()
    baseUrl: string;
  
    @IsOptional()
    @IsEnum(ProviderStatus)
    status?: ProviderStatus;
  
    @IsOptional()
    @IsUUID()
    companyId?: string;
  }