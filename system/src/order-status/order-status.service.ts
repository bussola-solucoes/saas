import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildWhereClause } from 'src/utils/buildWhereClause';
import { CreateOrderStatusDto } from './dto/create-order-status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderStatusService {
  
  constructor(private prisma: PrismaService) {}

  create(createOrderStatusDto: CreateOrderStatusDto) {
    return this.prisma.orderStatus.create({
      data: createOrderStatusDto,
    });
  }

  findAll(
    filters: any, 
    orderBy: Prisma.OrderStatusOrderByWithAggregationInput, 
    companyId: string) {
    const { page = 1, perPage = 20, ...query } = filters;
    const paginate = createPaginator({ perPage: perPage });
    return paginate<
      CreateOrderStatusDto,
      Prisma.OrderStatusAggregateArgs
    >(
      this.prisma.orderStatus,
      {
        where: buildWhereClause<Prisma.OrderStatusWhereInput>(query, companyId),
        orderBy,
      },
      { page },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} orderStatus`;
  }

  update(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.prisma.orderStatus.update({
      where: { id },
      data: updateOrderStatusDto,
    });
  }

  remove(id: string) {
    return this.prisma.orderStatus.delete({ where: { id } });
  }

}
