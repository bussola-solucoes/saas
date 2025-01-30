// src/integration/services/webhook.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DynamicIntegrationService } from './dynamic-integration.service';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly dynamicIntegration: DynamicIntegrationService,
  ) {}

  async processWebhook(companyId: string,providerId: string, payload: any, headers: any) {
    const provider = await this.prisma.externalProvider.findUnique({
      where: { id: providerId, companyId },
      include: { integrations: true },
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    for (const integration of provider.integrations) {
      if (integration.webhookUrl) {
        const result = await this.dynamicIntegration.executeEndpoint(
          companyId,
          integration.id,
          'webhook-endpoint-id', // Você precisará definir este endpoint para cada provedor
          { payload, headers }
        )
        
        return ({companyId: companyId, integrationId: integration.id, result });
      }
    }
  }
}
