import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserManager } from "./user.manager";
import { UsersController } from "./users.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule.register({})],
  providers: [UsersService, UserManager],
  controllers: [UsersController],
  exports: [UserManager],
})
export class UsersModule {}
