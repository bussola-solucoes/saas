import { Module } from '@nestjs/common';
import { ArtificialIntelligenceConversationService } from './artificial-intelligence-conversation.service';
import { ArtificialIntelligenceConversationController } from './artificial-intelligence-conversation.controller';

@Module({
  controllers: [ArtificialIntelligenceConversationController],
  providers: [ArtificialIntelligenceConversationService],
})
export class ArtificialIntelligenceConversationModule {}
