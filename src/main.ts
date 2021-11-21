import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    // For v1/v2 within the request url
    // For future proofing
    type: VersioningType.URI,
  });

  await app.listen(3000);
}
bootstrap();
