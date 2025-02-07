import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { HttpModule } from '@nestjs/axios';
import { AuditLogModule } from './audit-log/audit-log.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { MessageOrderStatusModule } from './message-order-status/message-order-status.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MessageOrderStatusSendModule } from './message-order-status-send/message-order-status-send.module';
import { CompanyModule } from './company/company.module';
import { FileModule } from './file/file.module';
import { FastifyMultipartOptions } from '@fastify/multipart'
import { IntegrationModule } from './integration/integration.module';
import { ExternalProviderModule } from './external-provider/external-provider.module';
import { ProviderEndpointModule } from './provider-endpoint/provider-endpoint.module';
import { ProviderCredentialModule } from './provider-credential/provider-credential.module';
import { DataMappingModule } from './data-mapping/data-mapping.module';
import { BullModule } from '@nestjs/bull';
import { BullConfigModule } from './bull-config/bull-config.module';
import { ArtificialIntelligenceModule } from './artificial-intelligence/artificial-intelligence.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    AuthModule,
    RolesModule,
    RolePermissionsModule,
    HttpModule,
    AuditLogModule,
    OrderStatusModule,
    MessageOrderStatusModule,
    ScheduleModule.forRoot(),
    MessageOrderStatusSendModule,
    EventEmitterModule.forRoot({
      wildcard: true
    }),
    CompanyModule,
    FileModule,
    IntegrationModule,
    ExternalProviderModule,
    ProviderEndpointModule,
    ProviderCredentialModule,
    DataMappingModule,
    BullConfigModule,
    ArtificialIntelligenceModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // { 
    //     provide: APP_INTERCEPTOR,
    //     useClass: LoggingInterceptor, // Aqui está o interceptor de log
    // }
  ],
})
export class AppModule {}
