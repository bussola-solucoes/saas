import { Test, TestingModule } from '@nestjs/testing';
import { ProviderCredentialService } from './provider-credential.service';

describe('ProviderCredentialService', () => {
  let service: ProviderCredentialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderCredentialService],
    }).compile();

    service = module.get<ProviderCredentialService>(ProviderCredentialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
