import { $Enums, Prisma } from "@prisma/client";

export class MessageOrderStatusSend implements Prisma.MessageOrderStatusSendUncheckedCreateInput {
    id?: string;
    code?: number;
    orderId: string;
    companyId?: string;
    statusCode: number;
    statusName: string;
    statusDate: string;
    name: string;
    email: string;
    phone: string;
    shippingName?: string;
    shippingValue?: string;
    shippingTime?: string;
    shippingCode?: string;
    shippingUrl?: string;
    statusSendWAPP?: $Enums.StatusSendWAPP;
    messageStatusSendWAPP?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    createdBy?: string;
    updatedBy?: string;
    
            
}
