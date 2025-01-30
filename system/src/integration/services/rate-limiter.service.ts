// src/integration/services/rate-limiter.service.ts
import { Injectable } from '@nestjs/common';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

@Injectable()
export class RateLimiterService {
  private rateLimiter: RateLimiterRedis;

  constructor() {
    const redisClient = new Redis({ 
      host: process.env.REDIS_HOST, 
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD
    });
    this.rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'integration_ratelimit',
      points: 10, // Número de solicitações
      duration: 1, // Por 1 segundo
    });
  }

  async checkLimit(companyId: string, integrationId: string): Promise<void> {
    try {
      await this.rateLimiter.consume(`${companyId}:${integrationId}`);
    } catch (error) {
      throw new Error('Rate limit exceeded');
    }
  }
}
