import { PartialType } from '@nestjs/swagger';
import { CreateArtificialIntelligenceConversationDto } from './create-artificial-intelligence-conversation.dto';

export class UpdateArtificialIntelligenceConversationDto extends PartialType(CreateArtificialIntelligenceConversationDto) {}
