import { Test, TestingModule } from '@nestjs/testing';
import { ArtificialIntelligenceTypeController } from './artificial-intelligence-type.controller';
import { ArtificialIntelligenceTypeService } from './artificial-intelligence-type.service';

describe('ArtificialIntelligenceTypeController', () => {
  let controller: ArtificialIntelligenceTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtificialIntelligenceTypeController],
      providers: [ArtificialIntelligenceTypeService],
    }).compile();

    controller = module.get<ArtificialIntelligenceTypeController>(ArtificialIntelligenceTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
