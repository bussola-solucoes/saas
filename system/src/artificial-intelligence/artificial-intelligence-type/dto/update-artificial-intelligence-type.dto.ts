import { PartialType } from '@nestjs/swagger';
import { CreateArtificialIntelligenceTypeDto } from './create-artificial-intelligence-type.dto';

export class UpdateArtificialIntelligenceTypeDto extends PartialType(CreateArtificialIntelligenceTypeDto) {}
