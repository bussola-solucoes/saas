import { Injectable } from '@nestjs/common';
import { CreateArtificialIntelligenceConversationDto } from './dto/create-artificial-intelligence-conversation.dto';
import { UpdateArtificialIntelligenceConversationDto } from './dto/update-artificial-intelligence-conversation.dto';

@Injectable()
export class ArtificialIntelligenceConversationService {
  create(createArtificialIntelligenceConversationDto: CreateArtificialIntelligenceConversationDto) {
    return 'This action adds a new artificialIntelligenceConversation';
  }

  findAll() {
    return `This action returns all artificialIntelligenceConversation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} artificialIntelligenceConversation`;
  }

  update(id: number, updateArtificialIntelligenceConversationDto: UpdateArtificialIntelligenceConversationDto) {
    return `This action updates a #${id} artificialIntelligenceConversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} artificialIntelligenceConversation`;
  }
}
