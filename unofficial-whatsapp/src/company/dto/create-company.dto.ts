import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from "class-validator";
import { Company } from "../entities/company.entity";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";

class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class CreateCompanyDto extends Company {
    @IsString({
        message: 'Necessário nome da empresa.',
    })
    name: string;

    @IsString({
        message: 'Necessário telefone da empresa.',
    })
    phone: string;

    @IsString({
        message: "Necessário endereço da empresa."
    })
    street: string;

    @IsString({
        message: 'Necessário bairro da empresa.',
    })
    neighborhood: string;

    @IsString({
        message: 'Necessário cidade da empresa.',
    })
    city: string;

    @IsString({
        message: 'Necessário estado da empresa.',
    })
    state: string;

    @IsString({
        message: 'Necessário país da empresa.',
    })
    country: string;

    @IsString({
        message: 'Necessário cep da empresa.',
    })
    zipCode: string;

    @IsOptional()
    cnpj?: string;
    
    @IsOptional()
    cpf?: string;
    
    @IsOptional()
    number?: number;
    
    @IsOptional()
    complement?: string;
    
    @IsOptional()
    logo?: string;
    
    @IsOptional()
    startTime?: string;
    
    @IsOptional()
    endTime?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    users: Prisma.UsersCreateNestedManyWithoutCompanyInput;
}
