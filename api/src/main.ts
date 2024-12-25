import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import {
  API_DESCRIPTION,
  API_TITLE,
  API_VERSION,
} from './common/constants/swagger.constants';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { bootstrap, setupSwagger } from './bootstrap';

async function start() {
  const app = await bootstrap();
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }
  await app.listen(3000);
}

start();
