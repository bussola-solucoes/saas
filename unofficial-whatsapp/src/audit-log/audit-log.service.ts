import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildWhereClause } from 'src/utils/buildWhereClause';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createAuditLogDto: CreateAuditLogDto) {
    return 'This action adds a new auditLog';
  }

  findAll(
    filters,
    orderBy,
    companyId: string
  ) {
    const { page = 1, perPage = 20, ...query } = filters;
    const paginate = createPaginator({ perPage: perPage });

    return paginate<CreateAuditLogDto, Prisma.AuditLogFindManyArgs>(
      this.prisma.auditLog,
      {
        where: buildWhereClause<Prisma.AuditLogWhereInput>(query, companyId),
        orderBy,
        select: {
          code: true,
          method: true,
          email: true,
          url: true,
          responseTime: true,
          statusCode: true,
          message: true,
          createdAt: true
        }
      },
      { page },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} auditLog`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateAuditLogDto: UpdateAuditLogDto) {
    return `This action updates a #${id} auditLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} auditLog`;
  }
}
