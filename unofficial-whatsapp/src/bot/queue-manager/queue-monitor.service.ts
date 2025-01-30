import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueManagerService } from './queue-manager.service';

@Injectable()
export class QueueMonitorService {
  private readonly logger = new Logger(QueueMonitorService.name);

  constructor(private queueManagerService: QueueManagerService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async monitorQueue() {
    try {
      const status = await this.queueManagerService.getQueueStatus();
      this.logger.verbose(`Queue status: ${JSON.stringify(status)}`);

      if (status.failed > 0) {
        this.logger.warn(`Found ${status.failed} failed jobs. Retrying...`);
        await this.queueManagerService.retryFailedJobs();
      }

      const stalledJobs = await this.queueManagerService.getPotentiallyStalledJobs();
      if (stalledJobs.length > 0) {
        this.logger.warn(`Found ${stalledJobs.length} potentially stalled jobs. Retrying...`);
        for (const job of stalledJobs) {
          await this.queueManagerService.retryJob(job.id);
        }
      }

      await this.queueManagerService.cleanOldJobs();
    } catch (error) {
      this.logger.error('Error monitoring queue:', error);
    }
  }
}
