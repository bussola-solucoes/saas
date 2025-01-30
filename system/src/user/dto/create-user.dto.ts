import { ApiProperty } from '@nestjs/swagger';
import { Users } from '../entities/user.entity';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUser extends Users {
  @IsString({
    message: 'Esqueceu do nome.',
  })
  @MinLength(2, {
    message: 'É necessário o nome do usuario!',
  })
  @ApiProperty()
  name: string;

  @IsEmail(
    {},
    {
      message: 'E-mail não valido!',
    },
  )
  @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
    message: 'Fora do formato email@provedor',
  })
  @ApiProperty()
  email: string;

  @IsString({
    message: 'Esqueceu da senha.',
  })
  @MinLength(6, {
    message: 'A senha deve conter 6 ou mais caracteres.',
  })
  @MaxLength(20, {
    message: 'A senha deve conter 20 ou menos caracteres.',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca, você consegue uma melhor!',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @MinLength(2, {
    message: 'É necessário o sobrenome do usuario!',
  })
  @ApiProperty()
  surname: string;

  @IsOptional()
  @ApiProperty()
  admin?: boolean;

  @IsOptional()
  @ApiProperty()
  disable?: boolean;

  @IsOptional()
  @ApiProperty()
  changePasswordAtNextLogon?: boolean;
}
