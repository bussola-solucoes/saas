import { Test, TestingModule } from '@nestjs/testing';
import { ArtificialIntelligenceConversationService } from './artificial-intelligence-conversation.service';

describe('ArtificialIntelligenceConversationService', () => {
  let service: ArtificialIntelligenceConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtificialIntelligenceConversationService],
    }).compile();

    service = module.get<ArtificialIntelligenceConversationService>(ArtificialIntelligenceConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
