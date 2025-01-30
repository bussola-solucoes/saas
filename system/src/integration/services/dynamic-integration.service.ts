// src/integration/services/dynamic-integration.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { IntegrationService } from '../integration.service';

@Injectable()
export class DynamicIntegrationService extends IntegrationService {
  private readonly logger = new Logger(DynamicIntegrationService.name);

  async executeEndpoint(
    companyId: string,
    integrationId: string,
    endpointId: string,
    payload?: any,
  ): Promise<Observable<any>> {
    return from(this.prepareRequest(companyId, integrationId, endpointId, payload)).pipe(
      mergeMap(({ endpoint, method, transformedPayload, headers }) =>
        this.executeRequest(endpoint, method, transformedPayload, headers).pipe(
          tap((response) =>
            this.logIntegrationActivity(
              companyId,
              integrationId,
              'RESPONSE',
              response,
              'SUCCESS',
            )
          ),
          map((response) => method == "GET" ? response : this.transformResponse(response, endpointId)),
        ),
      ),
    );
  }

  private async prepareRequest(
    companyId: string,
    integrationId: string,
    endpointId: string,
    payload?: any,
  ) {
    const integration = await this.prisma.integration.findUnique({
      where: { id: integrationId, companyId },
      include: { provider: true },
    });

    const endpoint = await this.prisma.providerEndpoint.findUnique({
      where: { id: endpointId, companyId },
      include: { mappings: true },
    });

    const credentials = await this.getProviderCredentials(integration.providerId, companyId);

    const transformedPayload = await this.transformPayload(
      payload,
      endpoint.mappings,
    );

    const headers = this.buildHeaders(credentials, endpoint.headers);

    console.log(endpoint.parameters)
    
    // Parse the parameters from the endpoint
    const allowedParameters = JSON.parse(JSON.stringify(endpoint.parameters))    

    // Filter the payload to only include allowed parameters
    const filteredParams = this.filterParameters(payload, allowedParameters);

    // Build the URL with query parameters
    let url = `${integration.provider.baseUrl}${endpoint.path}`;
    if (Object.keys(filteredParams).length > 0) {
      const queryString = new URLSearchParams(filteredParams).toString();
      url += `?${queryString}`;
    }

    

    return {
      endpoint: url,
      method: endpoint.method,
      transformedPayload,
      headers,
    };
  }
  
  private filterParameters(payload: any, allowedParameters: JSON) {
    const filteredParams: Record<string, any> = {};

    for (const [key, config] of Object.entries(allowedParameters)) {
      if (payload && payload.hasOwnProperty(key)) {
        // You can add more validation here based on the parameter configuration
        // For example, checking data types, required fields, etc.
        filteredParams[key] = payload[key];
      } else if (config.required) {
        throw new Error(`Missing required parameter: ${key}`);
      }
    }

    return filteredParams;
  }

  private async transformPayload(payload: any, mappings: any[]) {
    // Implementar lógica de transformação baseada nos mappings
    return mappings.reduce((acc, mapping) => {
      if (mapping.transformation) {
        acc[mapping.targetField] = this.applyTransformation(
          payload[mapping.sourceField],
          mapping.transformation,
        );
      } else {
        acc[mapping.targetField] = payload[mapping.sourceField];
      }
      return acc;
    }, {});
  }

  private applyTransformation(value: any, transformation: string) {
    // Implementar lógica de transformação dinâmica
    const transformationFn = new Function('value', transformation);
    return transformationFn(value);
  }

  private buildHeaders(credentials: any, requiredHeaders: any) {
    return {
      ...requiredHeaders,
      Authorization: `${credentials.key} ${credentials.token}`, // Ajustar conforme necessário
    };
  }

  private async transformResponse(response: any, endpointId: string) {
    const mappings = await this.prisma.dataMapping.findMany({
      where: { endpointId },
    });
    
    return await this.transformPayload(response, mappings);
  }

  async getLogs(
    companyId: string,
    integrationId: string,
    query: { startDate: string; endDate: string; limit: number; offset: number }
  ) {
    const { startDate, endDate, limit, offset } = query;

    return this.prisma.integrationLog.findMany({
      where: {
        companyId,
        integrationId,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
