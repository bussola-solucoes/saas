import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { AuditLogModule } from './audit-log/audit-log.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BotModule } from './bot/bot.module';
import { CompanyModule } from './company/company.module';
import { BullModule } from '@nestjs/bull';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    AuthModule,
    HttpModule,
    AuditLogModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: true
    }),
    BotModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    JwtService,
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
