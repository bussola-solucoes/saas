import { Prisma } from "@prisma/client";

export class OrderStatus implements Prisma.OrderStatusUncheckedCreateInput{
    id?: string;
    code: number;
    name: string;
    companyId?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    createdBy?: string;
    updatedBy?: string;
    messageOrderStatus?: Prisma.MessageOrderStatusUncheckedCreateNestedManyWithoutOrderStatusInput;
    messageOrderStatusSend?: Prisma.MessageOrderStatusSendUncheckedCreateNestedManyWithoutOrderStatusInput;
    
}
