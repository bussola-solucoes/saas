import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';

@Injectable()
export class QueueManagerService {
  private readonly logger = new Logger(QueueManagerService.name);

  constructor(@InjectQueue('unofficial-whatsapp') private whatsapp: Queue) {}

  async getQueueStatus(): Promise<any> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.whatsapp.getWaitingCount(),
      this.whatsapp.getActiveCount(),
      this.whatsapp.getCompletedCount(),
      this.whatsapp.getFailedCount(),
      this.whatsapp.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  async getFailedJobs(): Promise<Job[]> {
    return this.whatsapp.getFailed();
  }

  async retryFailedJobs(): Promise<void> {
    const failedJobs = await this.getFailedJobs();
    for (const job of failedJobs) {
      await job.retry();
    }
  }

  async cleanOldJobs(ageInSeconds: number = 3600): Promise<void> {
    await this.whatsapp.clean(ageInSeconds * 1000, 'completed');
  }

  async getPotentiallyStalledJobs(): Promise<Job[]> {
    const activeJobs = await this.whatsapp.getActive();
    const now = Date.now();
    return activeJobs.filter(job => 
      job.processedOn && (now - job.processedOn) > 300000 // 5 minutos
    );
  }

  async retryJob(jobId: string | number): Promise<void> {
    const job = await this.whatsapp.getJob(jobId);
    if (job) {
      await job.retry();
    }
  }

  async getJobDetails(jobId: string | number): Promise<Job | null> {
    return this.whatsapp.getJob(jobId);
  }
}
