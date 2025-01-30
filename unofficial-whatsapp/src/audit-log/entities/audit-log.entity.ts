import { Prisma } from "@prisma/client";

export class AuditLog implements Prisma.AuditLogUncheckedCreateInput {
    id?: string;
    code?: number;
    method: string;
    url: string;
    body: string;
    responseTime: number;
    response: string;
    userId?: string;
    email: string;
    statusCode: number;
    message: string;
    createdAt?: string | Date;
}
