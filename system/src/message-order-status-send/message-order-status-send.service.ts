// import { Injectable, Logger } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
// import { createPaginator } from 'prisma-pagination';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { buildWhereClause } from 'src/utils/buildWhereClause';
// import { CreateMessageOrderStatusSendDto } from './dto/create-message-order-status-send.dto';
// import { UpdateMessageOrderStatusSendDto } from './dto/update-message-order-status-send.dto';
// import { BotService } from '../bot/bot.service';

// @Injectable()
// export class MessageOrderStatusSendService {

//   private readonly logger = new Logger(BotService.name);

//   constructor(
//     private prisma: PrismaService,
//     private botService: BotService,
//   ) {}

//   async create(payload: {companyId: string, body: any, createdBy: string, updatedBy: string;} ) {

//     const { companyId, body } = payload;

//     const data: CreateMessageOrderStatusSendDto = {
//       statusCode: Number(body.data.status),
//       statusName: body.data.status_nome,
//       statusDate: body.data.status_data,
//       name: body.data.cliente.nome, //nome
//       email: body.data.cliente.email, //email
//       phone: body.data.cliente.telefone, //telefone
//       shippingCode: body.data.frete.rastreio, // codigo de rastreio
//       shippingName: body.data.frete.nome, // transportadora
//       shippingTime: body.data.frete.prazo + ' dias úteis', //tempo de entrega em dias uteis
//       shippingValue: body.data.frete.valor, // valor do frente
//       shippingUrl: body.data.frete.rastreio_url, //link de rastreio
//       orderId: body.data.pedido_id, //numero do pedido
//       companyId: companyId
//     }

//     const messageForSend = await this.prisma.messageOrderStatus.findFirst({ where : {statusName: body.data.status_nome}})

//     if ( messageForSend ) {

//       const created = await this.prisma.messageOrderStatusSend.create({
//         data,
//       });
  
//       function replacePlaceholders(template: string, data: Record<string, any>): string {
//         return template.replace(/{\s*(\w+)\s*}/g, (_, key) => {
//           const value = data[key];
//           return value !== undefined ? String(value) : `{${key}}`; // Substituir ou manter o placeholder
//         });
//       }
  
//       if (created) {
  
//         const stringifiedData = Object.fromEntries(
//           Object.entries(created).map(([key, value]) => [key, String(value)])
//         );
  
//         const message = await this.prisma.messageOrderStatus.findFirst({
//           where: {
//             statusCode: created.statusCode
//           }
//         })
  
//         if (message?.message) {

//           const placeHolders = replacePlaceholders(message?.message, stringifiedData);
//           this.botService.sendMessageBot(companyId, created.phone, placeHolders, created.id);
          
//         }
//       }

//     }

//   }

//   findAll(
//     filters: any, 
//     orderBy: Prisma.MessageOrderStatusSendOrderByWithAggregationInput, 
//     companyId: string) {
//     const { page = 1, perPage = 20, ...query } = filters;
//     const paginate = createPaginator({ perPage: perPage });
//     return paginate<
//     CreateMessageOrderStatusSendDto,
//       Prisma.MessageOrderStatusSendAggregateArgs
//     >(
//       this.prisma.messageOrderStatusSend,
//       {
//         where: buildWhereClause<Prisma.MessageOrderStatusSendWhereInput>(query, companyId),
//         orderBy,
//       },
//       { page },
//     );
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} messageOrderStatusSend`;
//   }

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   update(id: number, updateMessageOrderStatusSendDto: UpdateMessageOrderStatusSendDto) {
//     return `This action updates a #${id} messageOrderStatusSend`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} messageOrderStatusSend`;
//   }
// }
import { BadGatewayException, HttpCode, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildWhereClause } from 'src/utils/buildWhereClause';
import { CreateMessageOrderStatusSendDto } from './dto/create-message-order-status-send.dto';
import { UpdateMessageOrderStatusSendDto } from './dto/update-message-order-status-send.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MessageOrderStatusSendService {
  private readonly logger = new Logger(MessageOrderStatusSendService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('unofficial-whatsapp') private whatsappQueue: Queue,
  ) {}

  async create(payload: {companyId: string, body: any, createdBy: string, updatedBy: string;} ) {
    const { companyId, body } = payload;

    try {
      const data: CreateMessageOrderStatusSendDto = {
        statusCode: Number(body.data.status),
        statusName: body.data.status_nome,
        statusDate: body.data.status_data,
        name: body.data.cliente.nome,
        email: body.data.cliente.email,
        phone: body.data.cliente.telefone,
        shippingCode: body.data.frete.rastreio,
        shippingName: body.data.frete.nome,
        shippingTime: body.data.frete.prazo + ' dias úteis',
        shippingValue: body.data.frete.valor,
        shippingUrl: body.data.frete.rastreio_url,
        orderId: body.data.pedido_id,
        companyId: companyId
      }
      const messageForSend = await this.prisma.messageOrderStatus.findFirst({ where : {statusName: body.data.status_nome}})

      if (messageForSend) {
        const created = await this.prisma.messageOrderStatusSend.create({
          data,
        });

        if (created) {
          const stringifiedData = Object.fromEntries(
            Object.entries(created).map(([key, value]) => [key, String(value)])
          );

          const message = await this.prisma.messageOrderStatus.findFirst({
            where: {
              statusCode: created.statusCode
            }
          })

          if (message?.message) {
            const placeHolders = this.replacePlaceholders(message.message, stringifiedData);
            
            try {
              const job = await this.whatsappQueue.add(
                'send-message',
                {
                  companyId,
                  phone: created.phone,
                  message: placeHolders,
                  id: created.id
                }
              );

              return { status: 'success', jobId: job.id };
            } catch (error) {
              this.logger.error('Error adding job to queue', error.stack);
              throw new BadGatewayException('Failed to add job to queue');
            }
          } else {
            this.logger.warn('No message found for the given status code');
          }
        } else {
          this.logger.warn('Failed to create message order status send');
        }
      } else {
        this.logger.warn('No messageForSend found');
      }
    } catch (error) {
      this.logger.error('Error in create method', error.stack);
      throw new BadGatewayException('Failed to process message order status send');
    }
  }

  private replacePlaceholders(template: string, data: Record<string, any>): string {
    return template.replace(/{\s*(\w+)\s*}/g, (_, key) => {
      const value = data[key];
      return value !== undefined ? String(value) : `{${key}}`;
    });
  }

  findAll(
    filters: any, 
    orderBy: Prisma.MessageOrderStatusSendOrderByWithAggregationInput, 
    companyId: string) {
    const { page = 1, perPage = 20, ...query } = filters;
    const paginate = createPaginator({ perPage: perPage });
    return paginate<
    CreateMessageOrderStatusSendDto,
      Prisma.MessageOrderStatusSendAggregateArgs
    >(
      this.prisma.messageOrderStatusSend,
      {
        where: buildWhereClause<Prisma.MessageOrderStatusSendWhereInput>(query, companyId),
        orderBy,
      },
      { page },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} messageOrderStatusSend`;
  }

  update(id: number, updateMessageOrderStatusSendDto: UpdateMessageOrderStatusSendDto) {
    return `This action updates a #${id} messageOrderStatusSend`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageOrderStatusSend`;
  }
}
