import { Module } from '@nestjs/common';
import { ArtificialIntelligenceService } from './artificial-intelligence.service';
import { ArtificialIntelligenceController } from './artificial-intelligence.controller';
import { ArtificialIntelligenceTypeModule } from './artificial-intelligence-type/artificial-intelligence-type.module';
import { ArtificialIntelligenceModelModule } from './artificial-intelligence-model/artificial-intelligence-model.module';
import { ArtificialIntelligenceConversationModule } from './artificial-intelligence-conversation/artificial-intelligence-conversation.module';

@Module({
  controllers: [ArtificialIntelligenceController],
  providers: [ArtificialIntelligenceService],
  imports: [ArtificialIntelligenceTypeModule, ArtificialIntelligenceModelModule, ArtificialIntelligenceConversationModule],
})
export class ArtificialIntelligenceModule {}
