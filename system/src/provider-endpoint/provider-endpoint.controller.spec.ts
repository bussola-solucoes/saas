import { Test, TestingModule } from '@nestjs/testing';
import { ProviderEndpointController } from './provider-endpoint.controller';
import { ProviderEndpointService } from './provider-endpoint.service';

describe('ProviderEndpointController', () => {
  let controller: ProviderEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderEndpointController],
      providers: [ProviderEndpointService],
    }).compile();

    controller = module.get<ProviderEndpointController>(ProviderEndpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
