import { Module } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsController } from "./subscriptions.controller";
import { PrismaService } from "nestjs-prisma";

@Module({
  providers: [SubscriptionsService, PrismaService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
