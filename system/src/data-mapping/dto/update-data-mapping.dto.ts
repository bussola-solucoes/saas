import { PartialType } from '@nestjs/swagger';
import { CreateDataMappingDto } from './create-data-mapping.dto';

export class UpdateDataMappingDto extends PartialType(CreateDataMappingDto) {}
