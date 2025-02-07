import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { ArtificialIntelligenceService } from './artificial-intelligence.service';
import { CreateArtificialIntelligenceDto } from './dto/create-artificial-intelligence.dto';
import { UpdateArtificialIntelligenceDto } from './dto/update-artificial-intelligence.dto';
import DecryptToken from 'src/utils/decryptToken';

@Controller('artificial-intelligence')
export class ArtificialIntelligenceController {
  constructor(private readonly artificialIntelligenceService: ArtificialIntelligenceService) {}

  @Post()
  async create(
    @Headers() token: any,
    @Body() createArtificialIntelligenceDto: CreateArtificialIntelligenceDto
  ) {
    const { companyId } = await DecryptToken(token);
    return this.artificialIntelligenceService.create(createArtificialIntelligenceDto, companyId);
  }

  @Post('chat')
  async AI(
    @Headers() token: any,
    @Body() payload: {message: string}
  ) {
    const { companyId } = await DecryptToken(token);
    return this.artificialIntelligenceService.AI(companyId, payload.message);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artificialIntelligenceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtificialIntelligenceDto: UpdateArtificialIntelligenceDto) {
    return this.artificialIntelligenceService.update(+id, updateArtificialIntelligenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artificialIntelligenceService.remove(+id);
  }
}
