import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { BotService } from './bot.service';

@Processor('unofficial-whatsapp')
export class WhatsAppProcessor {
    constructor(private prisma: PrismaService,
        private botService: BotService) {}

    @Process('send-message')
    async handleSendMessage(job: Job) {
        const { companyId, phone, message, id } = job.data;

        function sanitizePhoneNumber(phone1: string): string {
            const cleaned = phone1.replace(/\D/g, '');      
            return '55' + cleaned;
        }
    
        const phoneSanitize = sanitizePhoneNumber(phone);

        try {
            this.botService.sendMessageBot(companyId, phoneSanitize, message, id);
        } catch (error) {
            await job.moveToFailed({ message: error.message }, true);
        }
        
    }
}