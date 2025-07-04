import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { CourseModule } from "./courses/courses.module";
import { CustomPrismaModule, PrismaModule } from "nestjs-prisma";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { EmailModule } from "./email/email.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import configurations from "./config";
import { RequestMiddleware } from "./middlewares/request.middleware";
import { AuthController } from "./auth/auth.controller";
import { CategoriesModule } from "./categories/categories.module";
import { AssetsModule } from "./assets/assets.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AwsModule } from "./aws/aws.module";
import { SearchModule } from "./search/search.module";
import dbConfig from "./config/db.config";
import {
  extendClient,
  EXTENDED_PRISMA_SERVICE,
} from "./common/prisma/pagination";
import { PrismaClient } from "@prisma/client";
import { AiModule } from "./ai/ai.module";
import { ProfileModule } from "./profile/profile.module";

const shouldServeStaticFiles =
  process.env.NODE_ENV === "development" && process.env.USE_S3 !== "true";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [...configurations],
      isGlobal: true,
      expandVariables: true,
    }),
    CourseModule,
    CustomPrismaModule.forRootAsync({
      name: EXTENDED_PRISMA_SERVICE,
      isGlobal: true,
      useFactory: async (config: ConfigType<typeof dbConfig>) => {
        return extendClient(
          new PrismaClient({ datasources: { db: { url: config.url } } })
        );
      },
      inject: [dbConfig.KEY],
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: async (config: ConfigType<typeof dbConfig>) => {
        return {
          prismaOptions: {
            datasources: {
              db: {
                url: config.url,
              },
            },
          },
        };
      },
      inject: [dbConfig.KEY],
    }),
    // Serve static files in development mode to provide s3 alternative
    ...(shouldServeStaticFiles
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "..", "uploads"),
            serveRoot: "/uploads",
          }),
        ]
      : []),
    AuthModule,
    UsersModule,
    EmailModule,
    SubscriptionsModule,
    CategoriesModule,
    AssetsModule,
    AwsModule,
    SearchModule,
    AiModule,
    ProfileModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes(AuthController);
  }
}
