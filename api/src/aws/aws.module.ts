import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { S3Client } from "@aws-sdk/client-s3";
import s3Config from "../config/s3.config";

export const S3_CLIENT = "S3_CLIENT";

@Module({
  imports: [ConfigModule],
  providers: [
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
  exports: [S3_CLIENT],
})
export class AwsModule {}
