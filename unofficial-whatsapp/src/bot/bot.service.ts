import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { whatsAppClient } from 'src/whatsapp.config';
import { Client } from 'whatsapp-web.js';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';


@Injectable()
export class BotService implements OnModuleInit {
    private clients: Map<string, Client> = new Map<string, Client>();
    private readonly logger = new Logger(BotService.name);
    private static isInitialized = false;
    private initializeClient(companyId?: string) {
        if (this.clients.has(companyId)) {
            return; // Cliente já inicializado
        }

        const client = whatsAppClient(companyId)


        this.setupEventListeners(client, companyId);

        try {
            client.initialize();
            this.logger.log(`Client initialized for company ${companyId}`);
        } catch (error) {
            this.logger.error(`Failed to initialize client for company ${companyId}: ${error.message}`);
            this.scheduleReconnection(companyId);
        }
    };

    constructor(
        private eventEmitter: EventEmitter2,
        private prisma: PrismaService,
        @InjectQueue('unofficial-whatsapp') private whatsappQueue: Queue,
    ) {}

    async onModuleInit() {
        if (BotService.isInitialized) {
            this.logger.log('BotService already initialized, skipping...');
            return;
        }

        try {
            BotService.isInitialized = true;
            const companies = await this.prisma.company.findMany();
            
            // Inicializa os clientes sequencialmente em vez de em paralelo
            for (const company of companies) {
                try {
                    this.initializeClient(company.id);
                } catch (error) {
                    this.logger.error(`Failed to initialize client for company ${company.id}: ${error.message}`);
                }
            }
        } catch (error) {
            BotService.isInitialized = false;
            this.logger.error(`Failed to initialize BotService: ${error.message}`);
            throw error;
        }
    }

    private setupEventListeners(client: Client, companyId: string) {
        client.on('qr', (qr) => {
            this.logger.log(`QrCode for company ${companyId}: ${qr}`);
            this.eventEmitter.emit(`qrcode.created.${companyId}`, { qr, companyId });
        });

        client.on('ready', () => {
            this.logger.verbose(`Company ${companyId} is connected successfully!`);
            this.eventEmitter.emit(`client.${companyId}`, { status: 'online', companyId });
        });

        client.on('authenticated', () => {
            this.logger.log(`Company ${companyId} is authenticated!`);
            this.eventEmitter.emit(`authenticated.${companyId}`, { status: 'online', companyId });
            this.eventEmitter.emit(`clientStart.${companyId}`, { companyId: companyId, client: client });
        });

        client.on('disconnected', () => {
            this.logger.log(`Company ${companyId} is disconnected!`);
            this.eventEmitter.emit(`disconnected.${companyId}`, { status: 'offline', companyId });
        });

        client.on('message', (msg) => {
            this.logger.verbose(`${companyId} - ${msg.from}: ${msg.body}`);
            if (msg.body == '!ping') {
                msg.reply('pong');
            }
        });
        
    }

    private scheduleReconnection(companyId: string) {
        this.logger.log(`Scheduling reconnection for company ${companyId}`);
        setTimeout(async () => {
            try {
                await this.initializeClient(companyId);
            } catch (error) {
                this.logger.error(`Reconnection failed for company ${companyId}: ${error.message}`);
                this.scheduleReconnection(companyId);
            }
        }, 5000);
    }

    getQrCode(companyId: string): string | null {
        console.log(this.clients)
        const client = this.clients.get(companyId);

        console.log(client)
        
        if (!client) {
            return null;
        }
        // You might need to implement a way to get the current QR code for the client
        // This depends on how whatsapp-web.js handles QR codes
    }

    async sendMessageBot(companyId: string, phone: string, message: string, id?: string): Promise<void> {
        function sanitizePhoneNumber(phone1: string): string {
            const cleaned = phone1.replace(/\D/g, '');      
            return '55' + cleaned;
        }
    
        const phoneSanitize = sanitizePhoneNumber(phone);
    
        if (!phoneSanitize) {
            throw new InternalServerErrorException('Invalid phone number');
        }
    
        try {
            const client = this.clients.get(companyId);
    
            client.getNumberId(phoneSanitize)
            .then(response => {
                if (response._serialized) {
                    client.sendMessage(response._serialized, message)
                        .then(async (res) => {
                            await this.prisma.messageOrderStatusSend.update({
                                where: {
                                    id
                                },
                                data: {
                                    statusSendWAPP: 'success',
                                    messageStatusSendWAPP: res.body
                                }
                            })
                        })
                        .catch(async (error) => {
                            await this.prisma.messageOrderStatusSend.update({
                                where: {
                                    id
                                },
                                data: {
                                    statusSendWAPP: 'error',
                                    messageStatusSendWAPP: error
                                }
                            })
                        })
                }
            })
            .catch(async (error) => {
                await this.prisma.messageOrderStatusSend.update({
                    where: {
                        id
                    },
                    data: {
                        statusSendWAPP: 'error',
                        messageStatusSendWAPP: phoneSanitize + ' ---> ' + error
                    }
                })
            })
        } catch (error) {
            await this.prisma.messageOrderStatusSend.update({
                where: { id },
                data: {
                    statusSendWAPP: 'error',
                    messageStatusSendWAPP: `${phoneSanitize} ---> ${error.message}`
                }
            });
            throw error; // Re-throw the error for the caller to handle
        }
    }

    @OnEvent('clientStart.*')
    handleClientEvent(payload: { companyId: string, client: Client }) {
        this.clients.set(payload.companyId, payload.client);
    }
}