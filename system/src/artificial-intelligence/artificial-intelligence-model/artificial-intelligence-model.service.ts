import { Injectable } from '@nestjs/common';
import { CreateArtificialIntelligenceModelDto } from './dto/create-artificial-intelligence-model.dto';
import { UpdateArtificialIntelligenceModelDto } from './dto/update-artificial-intelligence-model.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtificialIntelligenceModelService {

  constructor(private prisma: PrismaService) {}

  async create(createArtificialIntelligenceModelDto: CreateArtificialIntelligenceModelDto) {
    return await this.prisma.artificialIntelligenceModel.create({
      data: createArtificialIntelligenceModelDto
    })
  }

  findAll() {
    return `This action returns all artificialIntelligenceModel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} artificialIntelligenceModel`;
  }

  update(id: number, updateArtificialIntelligenceModelDto: UpdateArtificialIntelligenceModelDto) {
    return `This action updates a #${id} artificialIntelligenceModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} artificialIntelligenceModel`;
  }
}
