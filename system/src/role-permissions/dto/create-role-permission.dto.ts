import { IsBoolean } from "class-validator";
import { RolePermissions } from "../entities/role-permission.entity";

export class CreateRolePermissionDto extends RolePermissions {
    
    @IsBoolean()
    active?: boolean;

}
