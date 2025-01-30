import { Module } from '@nestjs/common';
import { ExternalProviderService } from './external-provider.service';
import { ExternalProviderController } from './external-provider.controller';

@Module({
  controllers: [ExternalProviderController],
  providers: [ExternalProviderService],
})
export class ExternalProviderModule {}
