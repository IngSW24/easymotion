import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserManager } from "./user.manager";
import { UsersController } from "./users.controller";

@Module({
  providers: [UsersService, UserManager],
  controllers: [UsersController],
  exports: [UserManager],
})
export class UsersModule {}
