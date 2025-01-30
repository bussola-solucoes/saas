import { Module } from '@nestjs/common';
import { ProviderEndpointService } from './provider-endpoint.service';
import { ProviderEndpointController } from './provider-endpoint.controller';

@Module({
  controllers: [ProviderEndpointController],
  providers: [ProviderEndpointService],
})
export class ProviderEndpointModule {}
