import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { MessageOrderStatus } from "../entities/message-order-status.entity";

export class CreateMessageOrderStatusDto extends MessageOrderStatus {

    @ApiProperty()
    @IsString()
    statusName: string;

    @ApiProperty()
    @IsString()
    message: string;
}
