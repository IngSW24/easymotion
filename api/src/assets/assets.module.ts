import { Module } from "@nestjs/common";
import { S3AssetsService } from "./implementations/s3.service";
import { CompressionService } from "./utilities/compression.service";
import { AwsModule } from "src/aws/aws.module";
import { ASSETS_SERVICE } from "./assets.interface";
import { MockAssetsService } from "./implementations/mock.service";

@Module({
  imports: [AwsModule],
  providers: [
    S3AssetsService,
    MockAssetsService,
    CompressionService,
    {
      provide: ASSETS_SERVICE,
      useClass:
        process.env.USE_S3 === "true" ? S3AssetsService : MockAssetsService,
    },
  ],
  exports: [ASSETS_SERVICE, CompressionService],
})
export class AssetsModule {}
