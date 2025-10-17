import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : [process.env.FRONTEND_URL, 'http://localhost:3001'],
    credentials: true,
  });



  await app.listen(process.env.PORT || 5000);
  console.log(`Backend running on port ${process.env.PORT || 5000}`);
}
bootstrap().catch(console.error);
