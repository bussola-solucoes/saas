import { Test, TestingModule } from '@nestjs/testing';
import { ProviderEndpointService } from './provider-endpoint.service';

describe('ProviderEndpointService', () => {
  let service: ProviderEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderEndpointService],
    }).compile();

    service = module.get<ProviderEndpointService>(ProviderEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
