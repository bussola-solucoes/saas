import { $Enums, Prisma } from "@prisma/client";

export class RolePermissions implements Prisma.RolePermissionsUncheckedCreateInput {
    id?: string;
    permission: $Enums.Permissions;
    companyId?: string;
    roleId: string;
    active?: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    createdBy?: string;
    updatedBy?: string;
    
}
