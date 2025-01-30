import { Test, TestingModule } from '@nestjs/testing';
import { ProviderCredentialController } from './provider-credential.controller';
import { ProviderCredentialService } from './provider-credential.service';

describe('ProviderCredentialController', () => {
  let controller: ProviderCredentialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderCredentialController],
      providers: [ProviderCredentialService],
    }).compile();

    controller = module.get<ProviderCredentialController>(ProviderCredentialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
