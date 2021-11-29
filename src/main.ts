import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { fastifyHelmet } from 'fastify-helmet';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('PORT');

  const config = new DocumentBuilder()
    .setTitle('Vexchange API')
    .setVersion('1.0')
    .addServer('v1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('/', app, document);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableShutdownHooks();
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
