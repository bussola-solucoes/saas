import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArtificialIntelligenceTypeService } from './artificial-intelligence-type.service';
import { CreateArtificialIntelligenceTypeDto } from './dto/create-artificial-intelligence-type.dto';
import { UpdateArtificialIntelligenceTypeDto } from './dto/update-artificial-intelligence-type.dto';

@Controller('artificial-intelligence-type')
export class ArtificialIntelligenceTypeController {
  constructor(private readonly artificialIntelligenceTypeService: ArtificialIntelligenceTypeService) {}

  @Post()
  create(@Body() createArtificialIntelligenceTypeDto: CreateArtificialIntelligenceTypeDto) {
    return this.artificialIntelligenceTypeService.create(createArtificialIntelligenceTypeDto);
  }

  @Get()
  findAll() {
    return this.artificialIntelligenceTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artificialIntelligenceTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtificialIntelligenceTypeDto: UpdateArtificialIntelligenceTypeDto) {
    return this.artificialIntelligenceTypeService.update(+id, updateArtificialIntelligenceTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artificialIntelligenceTypeService.remove(+id);
  }
}
