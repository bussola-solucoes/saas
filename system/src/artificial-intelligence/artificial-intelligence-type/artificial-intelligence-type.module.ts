import { Module } from '@nestjs/common';
import { ArtificialIntelligenceTypeService } from './artificial-intelligence-type.service';
import { ArtificialIntelligenceTypeController } from './artificial-intelligence-type.controller';

@Module({
  controllers: [ArtificialIntelligenceTypeController],
  providers: [ArtificialIntelligenceTypeService],
})
export class ArtificialIntelligenceTypeModule {}
