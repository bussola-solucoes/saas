import { PartialType } from '@nestjs/swagger';
import { CreateArtificialIntelligenceDto } from './create-artificial-intelligence.dto';

export class UpdateArtificialIntelligenceDto extends PartialType(CreateArtificialIntelligenceDto) {}
