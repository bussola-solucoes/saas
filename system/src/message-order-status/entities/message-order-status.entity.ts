import { Prisma } from "@prisma/client";

export class MessageOrderStatus implements Prisma.MessageOrderStatusUncheckedCreateInput {
    id?: string;
    code?: number;
    companyId?: string;
    statusCode: number;
    statusName: string;
    message: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    createdBy?: string;
    updatedBy?: string;
    
}
