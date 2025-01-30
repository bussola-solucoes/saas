import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Headers } from '@nestjs/common';
import { MessageOrderStatusSendService } from './message-order-status-send.service';
import { UpdateMessageOrderStatusSendDto } from './dto/update-message-order-status-send.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import DecryptToken from 'src/utils/decryptToken';
import { QueryTransformPipe } from 'src/utils/queryTransformPipe';

@Controller('messagesend')
export class MessageOrderStatusSendController {
  constructor(private readonly messageOrderStatusSendService: MessageOrderStatusSendService) {}

  @Roles('all')
  @Public()
  @Post('webhook/:id')
  async createWebHook(
    @Body() body,
    @Req() req,
    @Param('id') id:string
  ) {
    const payload = {
      companyId: id,
      body: body,
    }
    return this.messageOrderStatusSendService.create({
      ...payload,
      createdBy: req?.user?.id,
      updatedBy: req?.user?.id,
    });
  }

  @Roles('Message Order Status Send', 'views')
  @Get()
  @ApiQuery({ name: 'query', required: false })
  async findAll(@Headers() token, @Query(QueryTransformPipe) query?: any) {
    const { companyId } = await DecryptToken(token);
    const { orderBy, ...rest } = query;
    return this.messageOrderStatusSendService.findAll(rest, orderBy, companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageOrderStatusSendService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageOrderStatusSendDto: UpdateMessageOrderStatusSendDto) {
    return this.messageOrderStatusSendService.update(+id, updateMessageOrderStatusSendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageOrderStatusSendService.remove(+id);
  }
}
