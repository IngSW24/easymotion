import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "src/email/email.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RefreshStrategy } from "./strategies/refresh.strategy";
import { OtpStrategy } from "./strategies/otp.strategy";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get("jwt.secret"),
        signOptions: {
          expiresIn: configService.get("jwt.expiresIn"),
          audience: configService.get("jwt.audience"),
          issuer: configService.get("jwt.issuer"),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    EmailService,
    LocalStrategy,
    OtpStrategy,
    JwtStrategy,
    RefreshStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
