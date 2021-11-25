/* eslint-disable no-console */
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { fastifyHelmet } from "fastify-helmet";
import { writeFileSync } from "fs";
import { AppModule } from "./app.module";

async function bootstrap()
{
    const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    const config: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
        .setTitle("Vexchange API")
        .setVersion("1.0")
        .addServer("v1")
        .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    writeFileSync("./swagger-spec.json", JSON.stringify(document));
    SwaggerModule.setup("/", app, document);

    app.enableVersioning({
        type: VersioningType.URI,
    });

    app.enableShutdownHooks();
    await app.register(fastifyHelmet, {
        contentSecurityPolicy: false,
    });
    await app.listen(3000, "0.0.0.0");
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
