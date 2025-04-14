import { Module } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsController } from "./subscriptions.controller";
import { PrismaService } from "nestjs-prisma";
import { EmailModule } from "src/email/email.module";
import { CourseModule } from "src/courses/courses.module";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [EmailModule, CourseModule, UsersModule],
  providers: [SubscriptionsService, PrismaService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
