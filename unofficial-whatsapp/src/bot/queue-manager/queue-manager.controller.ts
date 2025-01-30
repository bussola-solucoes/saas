// queue-manager.controller.ts
import { Controller, Get, Post, Param, Logger } from '@nestjs/common';
import { QueueManagerService } from './queue-manager.service';

@Controller('queue-manager')
export class QueueManagerController {
  private readonly logger = new Logger(QueueManagerController.name);

  constructor(private queueManagerService: QueueManagerService) {}

  @Get('status')
  async getQueueStatus() {
    this.logger.log('Obtendo status da fila');
    return await this.queueManagerService.getQueueStatus();
  }

  @Get('failed-jobs')
  async getFailedJobs() {
    this.logger.log('Obtendo jobs falhos');
    return await this.queueManagerService.getFailedJobs();
  }

  @Post('retry-failed')
  async retryFailedJobs() {
    this.logger.log('Reprocessando jobs falhos');
    await this.queueManagerService.retryFailedJobs();
    return { message: 'Jobs falhos foram reprocessados' };
  }

  @Post('retry/:jobId')
  async retryJob(@Param('jobId') jobId: string) {
    this.logger.log(`Reprocessando job ${jobId}`);
    await this.queueManagerService.retryJob(jobId);
    return { message: `Job ${jobId} foi reprocessado` };
  }

  @Get('stalled-jobs')
  async getStalledJobs() {
    this.logger.log('Obtendo jobs potencialmente travados');
    return await this.queueManagerService.getPotentiallyStalledJobs();
  }

  @Post('clean-old-jobs')
  async cleanOldJobs() {
    this.logger.log('Limpando jobs antigos');
    await this.queueManagerService.cleanOldJobs();
    return { message: 'Jobs antigos foram limpos' };
  }

  @Get('job/:jobId')
  async getJobDetails(@Param('jobId') jobId: string) {
    this.logger.log(`Obtendo detalhes do job ${jobId}`);
    return await this.queueManagerService.getJobDetails(jobId);
  }
}
