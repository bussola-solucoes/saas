import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArtificialIntelligenceModelService } from './artificial-intelligence-model.service';
import { CreateArtificialIntelligenceModelDto } from './dto/create-artificial-intelligence-model.dto';
import { UpdateArtificialIntelligenceModelDto } from './dto/update-artificial-intelligence-model.dto';

@Controller('artificial-intelligence-model')
export class ArtificialIntelligenceModelController {
  constructor(private readonly artificialIntelligenceModelService: ArtificialIntelligenceModelService) {}

  @Post()
  create(@Body() createArtificialIntelligenceModelDto: CreateArtificialIntelligenceModelDto) {
    return this.artificialIntelligenceModelService.create(createArtificialIntelligenceModelDto);
  }

  @Get()
  findAll() {
    return this.artificialIntelligenceModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artificialIntelligenceModelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtificialIntelligenceModelDto: UpdateArtificialIntelligenceModelDto) {
    return this.artificialIntelligenceModelService.update(+id, updateArtificialIntelligenceModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artificialIntelligenceModelService.remove(+id);
  }
}
