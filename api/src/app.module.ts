import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CourseModule } from "./courses/courses.module";
import { PrismaModule } from "nestjs-prisma";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { EmailModule } from "./email/email.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import configurations from "./config";
import { RequestMiddleware } from "./middlewares/request.middleware";
import { AuthController } from "./auth/auth.controller";
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [...configurations],
      isGlobal: true,
      expandVariables: true,
    }),
    CourseModule,
    PrismaModule,
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          prismaOptions: {
            datasources: {
              db: {
                url: configService.get<string>("db.url"),
              },
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    SubscriptionsModule,
    CategoriesModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes(AuthController);
  }
}
