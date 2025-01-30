

import { HttpMethod } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsUUID, IsJSON } from 'class-validator';

export class CreateProviderEndpointDto {
  @IsString()
  name: string;

  @IsString()
  path: string;

  @IsEnum(HttpMethod)
  method: HttpMethod;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsJSON()
  parameters?: string;

  @IsOptional()
  @IsJSON()
  headers?: string;

  @IsUUID()
  providerId: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;
}