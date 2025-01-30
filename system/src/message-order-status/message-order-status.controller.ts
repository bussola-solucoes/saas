import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Headers } from '@nestjs/common';
import { MessageOrderStatusService } from './message-order-status.service';
import { CreateMessageOrderStatusDto } from './dto/create-message-order-status.dto';
import { UpdateMessageOrderStatusDto } from './dto/update-message-order-status.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import DecryptToken from 'src/utils/decryptToken';
import { QueryTransformPipe } from 'src/utils/queryTransformPipe';

@Controller('message-order-status')
export class MessageOrderStatusController {
  constructor(private readonly messageOrderStatusService: MessageOrderStatusService) {}

  @Roles('Message Order Status', 'insert')
  @Public()
  @Post()
  create(
    @Body() createMessageOrderStatusDto: CreateMessageOrderStatusDto,
    @Req() req
  ) {
    return this.messageOrderStatusService.create({
      ...createMessageOrderStatusDto,
      createdBy: req?.user?.id,
      updatedBy: req?.user?.id,
    });
  }

  @Roles('Message Order Status', 'views')
  @Get()
  @ApiQuery({ name: 'query', required: false })
  async findAll(@Headers() token, @Query(QueryTransformPipe) query?: any) {
    const { companyId } = await DecryptToken(token)
    const { orderBy, ...rest } = query;
    return this.messageOrderStatusService.findAll(rest, orderBy, companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageOrderStatusService.findOne(+id);
  }

  @Roles('Message Order Status', 'update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageOrderStatusDto: UpdateMessageOrderStatusDto,
    @Req() req,
  ) {
    return this.messageOrderStatusService.update(id, {
      ...updateMessageOrderStatusDto,
      updatedBy: req?.user?.id,
    });
  }

  @Roles('Message Order Status', 'delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageOrderStatusService.remove(id);
  }
}
