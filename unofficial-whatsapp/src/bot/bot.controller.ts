import { Body, Controller, Get, Headers, HttpCode, Post } from '@nestjs/common';
import { BotService } from './bot.service';
import { OnEvent } from '@nestjs/event-emitter';
import DecryptToken from 'src/utils/decryptToken';

@Controller('bot')
export class BotController {
  private qrCodes: Map<string, string> = new Map();
  private authenticatedEvents: Map<string, string> = new Map();
  private disconnectedEvents: Map<string, string> = new Map();

  constructor(private botService: BotService) {}

  @OnEvent('qrcode.created.*')
  handleQrcodeCreatedEvent(payload: { qr: string, companyId: string }) {
    this.qrCodes.set(payload.companyId, payload.qr);
  }

  @OnEvent('authenticated.*')
  handleAuthenticatedBotEvent(payload: { status: string, companyId: string }) {
    this.authenticatedEvents.set(payload.companyId, payload.status);
  }

  @OnEvent('disconnected.*')
  handleDisconnectedBotEvent(payload: { status: string, companyId: string }) {
    this.disconnectedEvents.set(payload.companyId, payload.status);
  }

  @HttpCode(200)
  @Post('status')
  async status(@Headers() token) {
      const { companyId } = await DecryptToken(token);
      const status = this.authenticatedEvents.get(companyId) || 
                     this.disconnectedEvents.get(companyId) || 
                     'offline';
      return { data: { status } };
  }

  @Get('qrcode')
  async getQrCode(@Headers() token) {
      const { companyId } = await DecryptToken(token);
      return this.qrCodes.get(companyId) || 'QR Code not available';
  }

  @Get('send-message')
  async sendMessage(
    @Headers() token, 
    @Body() payload: any
  ) {
    const { companyId } = await DecryptToken(token);
    return this.botService.sendMessageBot(companyId, payload.phone, payload.message);
  }

}