import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not defined in the DTO
      forbidNonWhitelisted: true, // reject unknown properties instead of silently dropping them
      transform: true, // auto-convert payloads to DTO instances
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  const port = config.get<string>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`CoChef API listening on http://localhost:${port}/api/v1`);
}

bootstrap();
