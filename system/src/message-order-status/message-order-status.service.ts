import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildWhereClause } from 'src/utils/buildWhereClause';
import { CreateMessageOrderStatusDto } from './dto/create-message-order-status.dto';
import { UpdateMessageOrderStatusDto } from './dto/update-message-order-status.dto';

@Injectable()
export class MessageOrderStatusService {

  constructor(private prisma: PrismaService) {}

  async create(createMessageOrderStatusDto: CreateMessageOrderStatusDto) {

    const statusCode = await this.prisma.orderStatus.findFirst({where: {name: createMessageOrderStatusDto.statusName}, select: {code: true}})

    if (statusCode.code) {
      return await this.prisma.messageOrderStatus.create({
        data: {
          ...createMessageOrderStatusDto,
          statusCode: statusCode.code
        },
      });
    }
    
  }

  findAll(
    filters: any, 
    orderBy: Prisma.MessageOrderStatusOrderByWithAggregationInput,
    companyId: string
  ) {
    const { page = 1, perPage = 20, ...query } = filters;
    const paginate = createPaginator({ perPage: perPage });

    return paginate<
      CreateMessageOrderStatusDto,
      Prisma.MessageOrderStatusAggregateArgs
    >(
      this.prisma.messageOrderStatus,
      {
        where: buildWhereClause<Prisma.MessageOrderStatusWhereInput>(query, companyId),
        orderBy,
      },
      { page },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} messageOrderStatus`;
  }

  update(
    id: string,
    updateMessageOrderStatusDto: UpdateMessageOrderStatusDto,
  ) {
    return this.prisma.messageOrderStatus.update({
      where: { id },
      data: updateMessageOrderStatusDto,
    });
  }

  remove(id: string) {
    return this.prisma.messageOrderStatus.delete({ where: { id } });
  }
}
