import { Test, TestingModule } from '@nestjs/testing';
import { ArtificialIntelligenceModelService } from './artificial-intelligence-model.service';

describe('ArtificialIntelligenceModelService', () => {
  let service: ArtificialIntelligenceModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtificialIntelligenceModelService],
    }).compile();

    service = module.get<ArtificialIntelligenceModelService>(ArtificialIntelligenceModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
