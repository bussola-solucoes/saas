import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { ArtificialIntelligenceType } from "../entities/artificial-intelligence-type.entity";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";


class CreateArtificialIntelligenceModelDto {
    @IsString()
    model: string;
  
    @IsOptional()
    @IsString()
    objectId?: string;
}

export class CreateArtificialIntelligenceTypeDto extends ArtificialIntelligenceType {
    @IsString({
        message: "É necessário a plataforma!"
    })
    platform: string;

    @IsString({
        message: "É necessário a url base da plataforma!"
    })
    baseUrl: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateArtificialIntelligenceModelDto)
    artificialIntelligenceModel?: CreateArtificialIntelligenceModelDto[];
}
