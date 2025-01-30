import { MessageOrderStatusSend } from "../entities/message-order-status-send.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMessageOrderStatusSendDto extends MessageOrderStatusSend {
    @ApiProperty()
    @IsNumber()
    statusCode: number;

    @ApiProperty()
    @IsString()
    statusName: string;

    @ApiProperty()
    @IsString()
    statusDate: string;

    @ApiProperty()
    @IsString()
    name: string;;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsOptional()
    shippingCode?: string;

    @ApiProperty()
    @IsOptional()
    shippingUrl?: string;

    @ApiProperty()
    @IsOptional()
    shippingName?: string;

    @ApiProperty()
    @IsOptional()
    shippingTime?: string;

    @ApiProperty()
    @IsOptional()
    shippingValue?: string;

    @ApiProperty()
    @IsString()
    orderId: string;
    
}
