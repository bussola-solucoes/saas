import { Test, TestingModule } from '@nestjs/testing';
import { ArtificialIntelligenceTypeService } from './artificial-intelligence-type.service';

describe('ArtificialIntelligenceTypeService', () => {
  let service: ArtificialIntelligenceTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtificialIntelligenceTypeService],
    }).compile();

    service = module.get<ArtificialIntelligenceTypeService>(ArtificialIntelligenceTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
