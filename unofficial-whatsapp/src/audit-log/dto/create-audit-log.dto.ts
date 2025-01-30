import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { AuditLog } from "../entities/audit-log.entity";

export class CreateAuditLogDto extends AuditLog {
    @IsString()
    method: string;

    @IsString()
    url: string;

    @IsString()
    body: string;

    @IsNumber()
    responseTime: number;

    @IsString()
    response: string;

    @IsString()
    email: string;

    @IsNumber()
    statusCode: number;

    @IsString()
    message: string;

    @IsOptional()
    createdAt?: string | Date;
}
