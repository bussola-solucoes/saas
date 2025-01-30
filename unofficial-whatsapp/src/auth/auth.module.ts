import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { BotService } from 'src/bot/bot.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PassportModule, 
    HttpModule.register({timeout: 60000}), 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '100y' }
    }),
    BullModule.registerQueue({
      name: 'unofficial-whatsapp',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        timeout: 30000,
        removeOnComplete: true,
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, BotService],
  controllers: [AuthController]
})
export class AuthModule {}
