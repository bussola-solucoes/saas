// src/integration/services/error-handler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen, tap } from 'rxjs/operators';

@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name);

  constructor(private readonly prisma: PrismaService) {}

  handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      this.logger.error(`${operation} failed: ${error.message}`, error.stack);
      return throwError(() => error);
    };
  }

  retryStrategy({ maxRetries = 3, scalingDuration = 1000, excludedStatusCodes = [] }: RetryStrategyOptions = {}) {
    return (attempts: Observable<any>) => {
      return attempts.pipe(
        mergeMap((error, i) => {
          const retryAttempt = i + 1;
          if (retryAttempt > maxRetries || excludedStatusCodes.find(e => e === error.status)) {
            return throwError(() => error);
          }
          this.logger.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
          return timer(retryAttempt * scalingDuration);
        }),
        tap(() => this.logger.log('Retrying...'))
      );
    };
  }

  async logError(integrationId: string, error: any) {
    await this.prisma.integrationLog.create({
      data: {
        integrationId,
        type: 'ERROR',
        status: 'ERROR',
        payload: error,
        error: error.message,
      },
    });
  }

  async handleIntegrationError(error: any, integrationId: string) {
    await this.prisma.integrationLog.create({
      data: {
        integrationId,
        type: 'ERROR',
        status: 'ERROR',
        error: JSON.stringify(error),
        payload: error.response?.data || {},
      },
    });
  }
}


interface RetryStrategyOptions {
  maxRetries?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
}
