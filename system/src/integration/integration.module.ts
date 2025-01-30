// src/integration/integration.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from '../prisma/prisma.module';
import { DynamicIntegrationService } from './services/dynamic-integration.service';
import { WebhookService } from './services/webhook.service';
import { SyncService } from './services/sync.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { MonitoringService } from './services/monitoring.service';
import { CacheService } from './services/cache.service';
import { RateLimiterService } from './services/rate-limiter.service';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { EncryptionService } from 'src/auth/encryption.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    PrismaModule,
    ScheduleModule.forRoot(),
    CacheModule.register(),
  ],
  providers: [
    IntegrationService,
    DynamicIntegrationService,
    WebhookService,
    SyncService,
    ErrorHandlerService,
    MonitoringService,
    CacheService,
    RateLimiterService,
    EncryptionService
  ],
  controllers: [IntegrationController],
  exports: [DynamicIntegrationService, WebhookService, SyncService],
})
export class IntegrationModule {}
