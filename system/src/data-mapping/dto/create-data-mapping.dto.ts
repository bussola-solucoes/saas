import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateDataMappingDto {
  @IsString()
  sourceField: string;

  @IsString()
  targetField: string;

  @IsOptional()
  @IsString()
  transformation?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsUUID()
  endpointId: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;
}