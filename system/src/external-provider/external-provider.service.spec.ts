import { Test, TestingModule } from '@nestjs/testing';
import { ExternalProviderService } from './external-provider.service';

describe('ExternalProviderService', () => {
  let service: ExternalProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalProviderService],
    }).compile();

    service = module.get<ExternalProviderService>(ExternalProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
