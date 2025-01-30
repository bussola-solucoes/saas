import { Module } from '@nestjs/common';
import { MessageOrderStatusSendService } from './message-order-status-send.service';
import { MessageOrderStatusSendController } from './message-order-status-send.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'unofficial-whatsapp',
      defaultJobOptions: {
        attempts: 3,
        //removeOnComplete: true,
      },
    }),
  ],
  controllers: [MessageOrderStatusSendController],
  providers: [MessageOrderStatusSendService],
})
export class MessageOrderStatusSendModule {}
