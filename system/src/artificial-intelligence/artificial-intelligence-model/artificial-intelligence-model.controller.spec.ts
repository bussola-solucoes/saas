import { Test, TestingModule } from '@nestjs/testing';
import { ArtificialIntelligenceModelController } from './artificial-intelligence-model.controller';
import { ArtificialIntelligenceModelService } from './artificial-intelligence-model.service';

describe('ArtificialIntelligenceModelController', () => {
  let controller: ArtificialIntelligenceModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtificialIntelligenceModelController],
      providers: [ArtificialIntelligenceModelService],
    }).compile();

    controller = module.get<ArtificialIntelligenceModelController>(ArtificialIntelligenceModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
