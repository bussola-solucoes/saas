import { PartialType } from '@nestjs/swagger';
import { CreateMessageOrderStatusDto } from './create-message-order-status.dto';

export class UpdateMessageOrderStatusDto extends PartialType(CreateMessageOrderStatusDto) {}
