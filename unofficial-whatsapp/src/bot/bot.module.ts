import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { BullConfigModule } from 'src/bull-config/bull-config.module';
import { BullModule } from '@nestjs/bull';
import { QueueManagerModule } from './queue-manager/queue-manager-module';
import { WhatsAppProcessor } from './bot.processor';
import { QueueManagerService } from './queue-manager/queue-manager.service';
import { QueueMonitorService } from './queue-manager/queue-monitor.service';

@Module({
  imports: [
    BullConfigModule,
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
  controllers: [BotController],
  providers: [BotService, WhatsAppProcessor, QueueManagerService, QueueMonitorService],
})
export class BotModule {}
