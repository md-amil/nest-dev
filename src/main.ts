import compression from 'compression';
import './register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connection } from './common/connection';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { initialize as apm } from './common/apm';

async function bootstrap() {
  apm();
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(compression());
  connection();
  // app.enableShutdownHooks();
  await app.listen(3000);
}

bootstrap();
