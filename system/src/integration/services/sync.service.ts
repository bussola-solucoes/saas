// src/integration/services/sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DynamicIntegrationService } from './dynamic-integration.service';
import { Cron } from '@nestjs/schedule';
import { Observable, from, of } from 'rxjs';
import { mergeMap, catchError, tap } from 'rxjs/operators';
import { $Enums } from '@prisma/client';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly dynamicIntegration: DynamicIntegrationService,
  ) {}

  @Cron('0 */4 * * *') // A cada 4 horas
  async scheduledSync() {
    const activeIntegrations = await this.prisma.integration.findMany({
      where: { status: 'ACTIVE' },
    });

    for (const integration of activeIntegrations) {
      await this.startSync(integration.companyId ,integration.id, 'FULL');
    }
  }

  async startSync(companyId: string, integrationId: string, type: $Enums.SyncType) {
    const job = await this.prisma.syncJob.create({
      data: {
        companyId,
        integrationId,
        type,
        status: 'PENDING',
      },
    });

    // Inicie o processo de sincronização de forma assíncrona
    this.runSync(job.id).catch(error => {
      console.error(`Sync job ${job.id} failed:`, error);
    });

    return job;
  }

  private async runSync(jobId: string) {
    const job = await this.prisma.syncJob.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new Error('Sync job not found');
    }

    await this.prisma.syncJob.update({
      where: { id: jobId },
      data: { status: 'RUNNING', startTime: new Date() },
    });

    try {
      const integration = await this.prisma.integration.findUnique({
        where: { id: job.integrationId },
        include: { provider: true },
      });

      // Implemente a lógica de sincronização aqui
      // Isso dependerá muito dos requisitos específicos de cada integração

      await this.prisma.syncJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          endTime: new Date(),
          // Atualize outras estatísticas conforme necessário
        },
      });
    } catch (error) {
      await this.prisma.syncJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          endTime: new Date(),
          errorCount: 1,
          // Adicione detalhes do erro conforme necessário
        },
      });
      throw error;
    }
  }

  async getSyncStatus(companyId:string, integrationId: string, jobId: string) {
    return this.prisma.syncJob.findFirst({
      where: { id: jobId, integrationId, companyId },
    });
  }
}
