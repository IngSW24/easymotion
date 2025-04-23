import { Module } from "@nestjs/common";
import { S3AssetsService } from "./s3.service";
import { ModuleRef } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import LocalAssetsService from "./local.service";

@Module({
  providers: [
    S3AssetsService,
    LocalAssetsService,
    {
      provide: "IAssetsService",
      inject: [ConfigService, ModuleRef],
      useFactory: (configService: ConfigService, moduleRef: ModuleRef) => {
        const useS3 = configService.get<boolean>("USE_S3");
        const token = useS3 ? S3AssetsService : LocalAssetsService;
        return moduleRef.get(token, { strict: false });
      },
    },
  ],
  exports: [S3AssetsService, LocalAssetsService, "IAssetsService"],
})
export class AssetsModule {}
