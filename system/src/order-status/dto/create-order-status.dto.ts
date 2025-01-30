import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { OrderStatus } from "../entities/order-status.entity";

export class CreateOrderStatusDto extends OrderStatus {
    @ApiProperty()
    @IsNumber()
    code: number;

    @ApiProperty()
    @IsString()
    name: string;
}
