import { Module } from '@nestjs/common';
import { DataMappingService } from './data-mapping.service';
import { DataMappingController } from './data-mapping.controller';

@Module({
  controllers: [DataMappingController],
  providers: [DataMappingService],
})
export class DataMappingModule {}
