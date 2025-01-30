import { Prisma } from "@prisma/client";

export class Users implements Prisma.UsersUncheckedCreateInput{
    id?: string;
    code?: number;
    objectId?: string;
    companyId?: string;
    name: string;
    email: string;
    password: string;
    admin?: boolean;
    disable?: boolean;
    surname: string;
    avatar?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    changePasswordAtNextLogon?: boolean;
    createdBy?: string;
    updatedBy?: string;
    roles?: Prisma.RolesUncheckedCreateNestedManyWithoutUsersInput;
    auditLog?: Prisma.AuditLogUncheckedCreateNestedManyWithoutUsersInput;
           
}


