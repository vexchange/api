/* eslint-disable no-console */
import { Logger, ValidationPipe, VersioningType, VERSION_NEUTRAL } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "@src/app.module";
import { fastifyHelmet } from "fastify-helmet";
import { writeFileSync } from "fs";

async function bootstrap()
{
    const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        { cors: true },
    );
    const logger: Logger = new Logger("NestApplication", { timestamp: true });
    const configService: ConfigService = app.get(ConfigService);
    const PORT: string =  <string>configService.get<string>("PORT");

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: VERSION_NEUTRAL,
    });

    const config: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
        .setTitle("Vexchange API")
        .setVersion(<string>process.env.npm_package_version)
        .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    writeFileSync("./swagger-spec.json", JSON.stringify(document));
    SwaggerModule.setup("/", app, document);

    app.enableShutdownHooks();
    await app.register(fastifyHelmet, {
        contentSecurityPolicy: false,
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(PORT, "0.0.0.0");
    logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
