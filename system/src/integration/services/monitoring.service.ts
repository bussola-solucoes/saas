// src/integration/services/monitoring.service.ts
import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Histogram } from 'prom-client';

@Injectable()
export class MonitoringService {
  private integrationCounter: Counter;
  private integrationDuration: Histogram;
  private activeIntegrations: Gauge;

  constructor() {
    this.integrationCounter = new Counter({
      name: 'integration_requests_total',
      help: 'Total number of integration requests',
      labelNames: ['integration', 'endpoint', 'status'],
    });

    this.integrationDuration = new Histogram({
      name: 'integration_request_duration_seconds',
      help: 'Duration of integration requests in seconds',
      labelNames: ['integration', 'endpoint'],
    });

    this.activeIntegrations = new Gauge({
      name: 'active_integrations',
      help: 'Number of active integrations',
    });
  }

  incrementIntegrationCounter(integration: string, endpoint: string, status: string) {
    this.integrationCounter.labels(integration, endpoint, status).inc();
  }

  recordIntegrationDuration(integration: string, endpoint: string, duration: number) {
    this.integrationDuration.labels(integration, endpoint).observe(duration);
  }

  setActiveIntegrations(count: number) {
    this.activeIntegrations.set(count);
  }
}
