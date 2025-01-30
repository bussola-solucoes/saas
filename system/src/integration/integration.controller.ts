// src/integration/controllers/integration.controller.ts
import { Controller, Post, Body, Param, Get, UseGuards, Req, HttpException, HttpStatus, Query, Headers, Delete, Patch } from '@nestjs/common';
import { DynamicIntegrationService } from './services/dynamic-integration.service';
import { WebhookService } from './services/webhook.service';
import { SyncService } from './services/sync.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { MonitoringService } from './services/monitoring.service';
import { CacheService } from './services/cache.service';
import { RateLimiterService } from './services/rate-limiter.service';
import { catchError, lastValueFrom, tap } from 'rxjs';
import DecryptToken from 'src/utils/decryptToken';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';

// src/integration/controllers/integration.controller.ts
@Controller('integrations')
export class IntegrationController {
  constructor(
    private readonly integrationService: DynamicIntegrationService,
    private readonly webhookService: WebhookService,
    private readonly syncService: SyncService,
    private readonly errorHandler: ErrorHandlerService,
    private readonly monitoring: MonitoringService,
    private readonly cacheService: CacheService,
    private readonly rateLimiter: RateLimiterService,
  ) {}

  @Post()
  async createIntegration(
    @Body() integrationData: CreateIntegrationDto,
    @Headers() token: any,
  ) {
    const { companyId, id } = await DecryptToken(token);
    return this.integrationService.create(integrationData, companyId);
  }

  @Get()
  async findAll(@Headers() token: any) {
    const { companyId, id } = await DecryptToken(token);
    return this.integrationService.findAll(companyId);
  }

  @Get(':integrationId')
  getIntegration(
    @Param('integrationId') integrationId: string
  ) {
    return this.integrationService.findOne(integrationId);
  }

  @Patch(':integrationId')
  async updateIntegration(
    @Param('integrationId') integrationId: string,
    @Body() updateData: UpdateIntegrationDto,
    @Headers() token: any,
  ) {
    const { companyId, id } = await DecryptToken(token);
    return this.integrationService.update(integrationId, updateData, companyId);
  }

  @Delete(':integrationId')
  deleteIntegration(@Param('integrationId') integrationId: string) {
    return this.integrationService.remove(integrationId);
  }

  @Post(':integrationId/endpoints/:endpointId')
  async executeEndpoint(
    @Param('integrationId') integrationId: string,
    @Param('endpointId') endpointId: string,
    @Body() payload: any,
    @Headers() token: any,
  ) {
    const { companyId, id } = await DecryptToken(token);
    
    try {
      await this.rateLimiter.checkLimit(companyId, integrationId);
      
      const cachedResult = await this.cacheService.get(`${integrationId}:${endpointId}:${JSON.stringify(payload)}`);
      if (cachedResult) {
        return cachedResult;
      }

      const startTime = Date.now();
      
      const result = await lastValueFrom(
        (await this.integrationService.executeEndpoint(companyId, integrationId, endpointId, payload)).pipe(
          tap(result => {
            const duration = Date.now() - startTime;
            this.monitoring.incrementIntegrationCounter(integrationId, endpointId, 'success');
            this.monitoring.recordIntegrationDuration(integrationId, endpointId, duration);
            this.cacheService.set(`${integrationId}:${endpointId}:${JSON.stringify(payload)}`, result);
          }),
          catchError(error => {
            const duration = Date.now() - startTime;
            this.monitoring.incrementIntegrationCounter(integrationId, endpointId, 'error');
            this.monitoring.recordIntegrationDuration(integrationId, endpointId, duration);
            this.errorHandler.handleIntegrationError(error, integrationId);
            throw new HttpException('Integration execution failed', HttpStatus.INTERNAL_SERVER_ERROR);
          })
        )
      );

      return result;
    } catch (error) {
      this.errorHandler.handleIntegrationError(error, integrationId);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Rate limit exceeded or other error', HttpStatus.TOO_MANY_REQUESTS);
    }
  }


  @Post(':integrationId/sync')
  async syncIntegration(
    @Param('integrationId') integrationId: string,
    @Body() syncOptions: { type: 'FULL' | 'INCREMENTAL' },
    @Headers() token: any,
  ) {
    const { companyId, id } = await DecryptToken(token);
    return this.syncService.startSync(companyId, integrationId, syncOptions.type);
  }

  @Get(':integrationId/sync/:jobId')
  async getSyncStatus(
    @Param('integrationId') integrationId: string,
    @Param('jobId') jobId: string,
    @Headers() token: any,
  ) {
    const { companyId, id } = await DecryptToken(token);
    return this.syncService.getSyncStatus(companyId, integrationId, jobId);
  }

  @Post('webhook/:providerId')
  async handleWebhook(
    @Param('providerId') providerId: string,
    @Body() payload: any,
    @Req() req: Request,
    @Headers() token: any,
  ) {
    const { companyId, id } = await DecryptToken(token);
    return this.webhookService.processWebhook(companyId, providerId, payload, req.headers);
  }

  @Get(':integrationId/logs')
  async getIntegrationLogs(
    @Param('integrationId') integrationId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Headers() token: any,
  ) {
    const { companyId, id } = await DecryptToken(token);
    return this.integrationService.getLogs(
      companyId,
      integrationId,
      {
        startDate,
        endDate,
        limit: limit ? parseInt(limit.toString(), 10) : 10, // default limit
        offset: offset ? parseInt(offset.toString(), 10) : 0, // default offset
      }
    );
  }
}

