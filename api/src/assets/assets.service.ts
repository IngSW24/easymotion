import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import s3Config from "src/config/s3.config";
import { Readable } from "stream";

@Injectable()
export class AssetsService {
  private s3: S3Client;
  private bucket: string;

  constructor(
    @Inject(s3Config.KEY)
    private readonly config: ConfigType<typeof s3Config>
  ) {
    const { accessKeyId, secretAccessKey, region } = this.config;
    this.bucket = this.config.bucket;
    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async listBuckets(prefix: string = "") {
    return this.s3.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
      })
    );
  }

  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;
  }

  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    filename: string,
    contentType: string
  ): Promise<string> {
    const key = `${folder}/${filename}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    return key;
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  async getFileStream(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.s3.send(command);
    return response.Body as Readable;
  }
}
