/**
 * Worker application for processing background jobs
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  Logger.log('🔧 Worker application started and listening for jobs...');
}

bootstrap();
