import { Module } from '@nestjs/common';
import { QueueManagerController } from './queue-manager.controller';
import { BullModule } from '@nestjs/bull';
import { QueueManagerService } from './queue-manager.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'unofficial-whatsapp',
    }),
  ],
  controllers: [QueueManagerController],
  providers: [QueueManagerService],
})
export class QueueManagerModule {}
