import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArtificialIntelligenceConversationService } from './artificial-intelligence-conversation.service';
import { CreateArtificialIntelligenceConversationDto } from './dto/create-artificial-intelligence-conversation.dto';
import { UpdateArtificialIntelligenceConversationDto } from './dto/update-artificial-intelligence-conversation.dto';

@Controller('artificial-intelligence-conversation')
export class ArtificialIntelligenceConversationController {
  constructor(private readonly artificialIntelligenceConversationService: ArtificialIntelligenceConversationService) {}

  @Post()
  create(@Body() createArtificialIntelligenceConversationDto: CreateArtificialIntelligenceConversationDto) {
    return this.artificialIntelligenceConversationService.create(createArtificialIntelligenceConversationDto);
  }

  @Get()
  findAll() {
    return this.artificialIntelligenceConversationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artificialIntelligenceConversationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtificialIntelligenceConversationDto: UpdateArtificialIntelligenceConversationDto) {
    return this.artificialIntelligenceConversationService.update(+id, updateArtificialIntelligenceConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artificialIntelligenceConversationService.remove(+id);
  }
}
