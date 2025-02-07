import { PartialType } from '@nestjs/swagger';
import { CreateArtificialIntelligenceModelDto } from './create-artificial-intelligence-model.dto';

export class UpdateArtificialIntelligenceModelDto extends PartialType(CreateArtificialIntelligenceModelDto) {}
