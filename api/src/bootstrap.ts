import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import {
  API_DESCRIPTION,
  API_TITLE,
  API_VERSION,
} from "./common/constants/swagger.constants";
import { PrismaClientExceptionFilter } from "nestjs-prisma";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
  });

  const configService = app.get(ConfigService);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const corsOrigins = configService.get<string>("FRONTEND_URL");

  app.enableCors({
    origin:
      corsOrigins.replaceAll(" ", "").split(",") ??
      "https://dev.easymotion.it",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allows cookies or auth headers
    exposedHeaders: "Content-Disposition",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    })
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    })
  );

  app.use(cookieParser());

  return app;
}

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(API_TITLE)
    .setDescription(API_DESCRIPTION)
    .setVersion(API_VERSION)
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      in: "header",
      name: "Authorization",
      description: "Enter your Bearer token",
    })
    .addSecurityRequirements("bearer")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("swagger", app, document, {
    jsonDocumentUrl: "swagger/json",
  });

  return document;
}
