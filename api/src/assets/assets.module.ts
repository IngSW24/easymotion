import { Module } from "@nestjs/common";
import { S3AssetsService } from "./s3.service";
import { ModuleRef } from "@nestjs/core";
import { ConfigType } from "@nestjs/config";
import { ImageCompressionService } from "./image-compression.service";
import { S3Module } from "src/s3/s3.module";
import { ASSETS_SERVICE } from "./assets.interface";
import assetsConfig from "src/config/assets.config";
import { MockAssetsService } from "./mock.service";

@Module({
  imports: [S3Module],
  providers: [
    S3AssetsService,
    MockAssetsService,
    ImageCompressionService,
    {
      provide: ASSETS_SERVICE,
      useClass: process.env.USE_S3 ? S3AssetsService : MockAssetsService,
    },
  ],
  exports: [ASSETS_SERVICE, ImageCompressionService],
})
export class AssetsModule {}
