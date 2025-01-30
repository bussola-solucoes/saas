import { Test, TestingModule } from '@nestjs/testing';
import { ExternalProviderController } from './external-provider.controller';
import { ExternalProviderService } from './external-provider.service';

describe('ExternalProviderController', () => {
  let controller: ExternalProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExternalProviderController],
      providers: [ExternalProviderService],
    }).compile();

    controller = module.get<ExternalProviderController>(ExternalProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
