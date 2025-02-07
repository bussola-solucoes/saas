import { IsOptional, IsString } from "class-validator";
import { ArtificialIntelligence } from "../entities/artificial-intelligence.entity";

export class CreateArtificialIntelligenceDto extends ArtificialIntelligence {
    @IsString({
        message: "É necessário a api key!"
    })
    apiKey: string;

    @IsString({
        message: "É necessário o prompt!"
    })
    prompt: string;

    @IsOptional()
    assistantId?: string;

    @IsOptional()
    aiVersion?: string;

    @IsString({
        message: "É necessário a plataforma!"
    })
    platform: string;

    @IsString({
        message: "É necessário o modelo!"
    })
    model: string;

    @IsOptional()
    nameAI?: string;
}
