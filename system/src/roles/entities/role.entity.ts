import { Prisma } from "@prisma/client";

export class Roles implements Prisma.RolesUncheckedCreateInput {
    id?: string;
    name: string;
    description?: string;
    companyId?: string;
    usersId: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    createdBy?: string;
    updatedBy?: string;
    permissions?: Prisma.RolePermissionsUncheckedCreateNestedManyWithoutRolesInput;
    
}
