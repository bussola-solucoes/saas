import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Headers } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { CreateOrderStatusDto } from './dto/create-order-status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ApiQuery } from '@nestjs/swagger';
import DecryptToken from 'src/utils/decryptToken';
import { QueryTransformPipe } from 'src/utils/queryTransformPipe';

@Controller('order-status')
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @Roles('Order Status', 'insert')
  @Post()
  create(
    @Body() createOrderStatusDto: CreateOrderStatusDto,
    @Req() req
  ) {
    return this.orderStatusService.create({
      ...createOrderStatusDto,
      createdBy: req?.user?.id,
      updatedBy: req?.user?.id,
    });
  }

  @Roles('Order Status', 'views')
  @Get()
  @ApiQuery({ name: 'query', required: false })
  async findAll(@Headers() token, @Query(QueryTransformPipe) query?: any) {
    const { companyId } = await DecryptToken(token);
    const { orderBy, ...rest } = query;
    return this.orderStatusService.findAll(rest, orderBy, companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderStatusService.findOne(+id);
  }

  @Roles('Order Status', 'update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Req() req,
  ) {
    return this.orderStatusService.update(id, {
      ...updateOrderStatusDto,
      updatedBy: req?.user?.id,
    });
  }

  @Roles('Order Status', 'delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderStatusService.remove(id);
  }

  
}
