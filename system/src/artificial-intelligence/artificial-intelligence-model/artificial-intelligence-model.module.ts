import { Module } from '@nestjs/common';
import { ArtificialIntelligenceModelService } from './artificial-intelligence-model.service';
import { ArtificialIntelligenceModelController } from './artificial-intelligence-model.controller';

@Module({
  controllers: [ArtificialIntelligenceModelController],
  providers: [ArtificialIntelligenceModelService],
})
export class ArtificialIntelligenceModelModule {}
