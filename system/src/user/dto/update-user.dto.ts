import { PartialType } from '@nestjs/mapped-types';
import { CreateUser } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUser) {
  
}
