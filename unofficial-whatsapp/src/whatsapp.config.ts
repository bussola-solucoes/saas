import { Client, LocalAuth } from 'whatsapp-web.js';

export const whatsAppClient = (companyId: string) => {

    return new Client({
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--single-process',
                '--disable-web-security'
            ],
            defaultViewport: null,
            timeout: 60000, // Aumenta o timeout para 60 segundos
            waitForInitialPage: true,
        },
        authStrategy: new LocalAuth({
            clientId: companyId
        }),
        restartOnAuthFail: true,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
};
