import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { AssetsModule } from "src/assets/assets.module";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [AssetsModule, UsersModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
