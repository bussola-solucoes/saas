import { PartialType } from '@nestjs/swagger';
import { CreateMessageOrderStatusSendDto } from './create-message-order-status-send.dto';

export class UpdateMessageOrderStatusSendDto extends PartialType(CreateMessageOrderStatusSendDto) {}
