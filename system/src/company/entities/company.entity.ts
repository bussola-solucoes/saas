import { Prisma } from "@prisma/client";

export class Company implements Prisma.CompanyUncheckedCreateInput {
    id?: string;
    name: string;
    cnpj?: string;
    cpf?: string;
    phone: string;
    street: string;
    number?: number;
    neighborhood: string;
    complement?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    disable?: boolean;
    paymentDate?: string | Date;
    logo?: string;
    startTime?: string;
    endTime?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    createdBy?: string;
    updatedBy?: string;
    users?: Prisma.UsersUncheckedCreateNestedManyWithoutCompanyInput;
    roles?: Prisma.RolesUncheckedCreateNestedManyWithoutCompanyInput;
    rolePermissions?: Prisma.RolePermissionsUncheckedCreateNestedManyWithoutCompanyInput;
    orderStatus?: Prisma.OrderStatusUncheckedCreateNestedManyWithoutCompanyInput;
    messageOrderStatus?: Prisma.MessageOrderStatusUncheckedCreateNestedManyWithoutCompanyInput;
    messageOrderStatusSend?: Prisma.MessageOrderStatusSendUncheckedCreateNestedManyWithoutCompanyInput;
    auditLog?: Prisma.AuditLogUncheckedCreateNestedManyWithoutCompanyInput;
    
}
