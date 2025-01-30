// src/integration/services/base-integration.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { EncryptionService } from 'src/auth/encryption.service';

@Injectable()
export class IntegrationService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly httpService: HttpService,
    protected readonly encryptionService: EncryptionService,
  ) {}

  protected async getProviderCredentials(providerId: string, companyId: string) {
    const credentials = await this.prisma.providerCredential.findMany({
      where: { providerId, isActive: true, companyId },
    });
    return credentials.reduce((acc, curr) => {
      acc = {
        token: this.encryptionService.decrypt(curr.value),
        key: curr.key
      }
      return acc;
    }, {});
  }

  protected executeRequest<T>(
    endpoint: string,
    method: string,
    data?: any,
    headers?: any,
  ): Observable<T> {
    const request = this.httpService.request({
      url: endpoint,
      method,
      data,
      headers,
    });

    return request.pipe(
      map((response: AxiosResponse) => response.data),
      catchError((error) => throwError(() => error)),
    );
  }

  protected async logIntegrationActivity(
    companyId: string,
    integrationId: string,
    type: 'REQUEST' | 'RESPONSE' | 'ERROR',
    payload: any,
    status: 'SUCCESS' | 'ERROR' | 'PENDING',
    error?: string,
  ) {
    return this.prisma.integrationLog.create({
      data: {
        companyId,
        integrationId,
        type,
        status,
        payload,
        error,
      },
    });
  }

  async create(data: CreateIntegrationDto, companyId: string) {
    return this.prisma.integration.create({
      data: {
        ...data,
        companyId,
      },
    });
  }

  async findAll(companyId?: string) {
    return this.prisma.integration.findMany({
      where: companyId ? { companyId } : {},
    });
  }

  async findOne(id: string) {
    return this.prisma.integration.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateIntegrationDto, companyId: string) {
    return this.prisma.integration.update({
      where: { id, companyId },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.integration.delete({ where: { id } });
  }
}
