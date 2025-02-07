import { Injectable } from '@nestjs/common';
import { CreateArtificialIntelligenceTypeDto } from './dto/create-artificial-intelligence-type.dto';
import { UpdateArtificialIntelligenceTypeDto } from './dto/update-artificial-intelligence-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtificialIntelligenceTypeService {

  constructor(private prisma: PrismaService) {}

  async create(createArtificialIntelligenceTypeDto: CreateArtificialIntelligenceTypeDto) {

    const models =  createArtificialIntelligenceTypeDto.artificialIntelligenceModel

    return await this.prisma.artificialIntelligenceType.create({
      data: {
        ...createArtificialIntelligenceTypeDto,
        artificialIntelligenceModel: {
          createMany: {
            data: createArtificialIntelligenceTypeDto.artificialIntelligenceModel
          }
        }
      }
    })
  }

  findAll() {
    return `This action returns all artificialIntelligenceType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} artificialIntelligenceType`;
  }

  update(id: number, updateArtificialIntelligenceTypeDto: UpdateArtificialIntelligenceTypeDto) {
    return `This action updates a #${id} artificialIntelligenceType`;
  }

  remove(id: number) {
    return `This action removes a #${id} artificialIntelligenceType`;
  }
}
