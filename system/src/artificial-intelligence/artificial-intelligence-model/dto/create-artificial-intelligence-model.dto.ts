import { IsString } from "class-validator";
import { ArtificialIntelligenceModel } from "../entities/artificial-intelligence-model.entity";

export class CreateArtificialIntelligenceModelDto extends ArtificialIntelligenceModel {
    @IsString({
        message: "É necessário o modelo!"
    })
    model: string;
}
