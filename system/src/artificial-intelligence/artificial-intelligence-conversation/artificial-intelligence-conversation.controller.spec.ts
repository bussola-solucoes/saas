import { Test, TestingModule } from '@nestjs/testing';
import { ArtificialIntelligenceConversationController } from './artificial-intelligence-conversation.controller';
import { ArtificialIntelligenceConversationService } from './artificial-intelligence-conversation.service';

describe('ArtificialIntelligenceConversationController', () => {
  let controller: ArtificialIntelligenceConversationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtificialIntelligenceConversationController],
      providers: [ArtificialIntelligenceConversationService],
    }).compile();

    controller = module.get<ArtificialIntelligenceConversationController>(ArtificialIntelligenceConversationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
