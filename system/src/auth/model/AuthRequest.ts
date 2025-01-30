import { Request } from 'express';
import { Users } from 'src/user/entities/user.entity';

interface UserWithRoles {
  id: string;
  objectId: string;
  companyId: string;
  name: string;
  email: string;
  admin?: boolean;
  disable?: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: any;
}


export interface AuthRequest extends Request {
  request: any;
  [x: string]: any;
  principal: Users;
  principalRoles: UserWithRoles;  // Atualize para o tipo adequado
  
}