import { Test, TestingModule } from '@nestjs/testing';
import { DataMappingController } from './data-mapping.controller';
import { DataMappingService } from './data-mapping.service';

describe('DataMappingController', () => {
  let controller: DataMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataMappingController],
      providers: [DataMappingService],
    }).compile();

    controller = module.get<DataMappingController>(DataMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
