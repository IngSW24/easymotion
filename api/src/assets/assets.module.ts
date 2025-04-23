import { Module } from "@nestjs/common";
import { S3AssetsService } from "./s3.service";
import { ModuleRef } from "@nestjs/core";
import { ConfigService, ConfigType } from "@nestjs/config";
import LocalAssetsService from "./local.service";
import { ImageCompressionService } from "./image-compression.service";
import s3Config from "src/config/s3.config";
import { S3Client } from "@aws-sdk/client-s3";

export const S3_CLIENT = "S3_CLIENT";

@Module({
  providers: [
    S3AssetsService,
    LocalAssetsService,
    ImageCompressionService,
    {
      provide: "IAssetsService",
      inject: [ConfigService, ModuleRef],
      useFactory: (configService: ConfigService, moduleRef: ModuleRef) => {
        const useS3 = configService.get<boolean>("USE_S3");
        const token = useS3 ? S3AssetsService : LocalAssetsService;
        return moduleRef.get(token, { strict: false });
      },
    },
    {
      provide: S3_CLIENT,
      useFactory: (config: ConfigType<typeof s3Config>) => {
        return new S3Client({
          region: config.region,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
        });
      },
      inject: [s3Config.KEY],
    },
  ],
  exports: [
    S3AssetsService,
    LocalAssetsService,
    "IAssetsService",
    ImageCompressionService,
    S3_CLIENT,
  ],
})
export class AssetsModule {}
