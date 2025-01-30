import { Module } from '@nestjs/common';
import { MessageOrderStatusService } from './message-order-status.service';
import { MessageOrderStatusController } from './message-order-status.controller';

@Module({
  controllers: [MessageOrderStatusController],
  providers: [MessageOrderStatusService],
})
export class MessageOrderStatusModule {}
