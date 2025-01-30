import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UnauthorizedInterceptor } from './interceptors/Unauthorized.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
  );

  const allowedOrigins = process.env.ORIGIN;

  // app.use((req, res, next) => {
  //   const origin = req.headers.origin;

  //   // Se não há `Origin` ou se não é permitida
  //   // if (!origin || !allowedOrigins.includes(origin)) {
  //   //   throw new UnauthorizedException('Origin não permitida ou ausente.');
  //   // }

  //   next();
  // });
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  });

  const config = new DocumentBuilder()
    .setTitle('WhatsApp Automation')
    .setDescription('API to create bot')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .build();

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //Interceptors
  app.useGlobalInterceptors(new UnauthorizedInterceptor());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(5408);
}

bootstrap();
