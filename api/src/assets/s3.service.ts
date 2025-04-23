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
import IAssetsService from "./assets.interface";

@Injectable()
export class S3AssetsService implements IAssetsService {
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

  /**
   * List all buckets in S3
   * @param prefix the prefix to list the buckets with
   * @returns the list of buckets
   */
  async listBuckets(prefix: string = "") {
    return this.s3.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
      })
    );
  }

  /**
   * Upload a buffer to S3
   * @param buffer the buffer to upload
   * @param folder the folder to upload the buffer to
   * @param filename the filename of the buffer
   * @param contentType the content type of the buffer
   * @returns the key of the uploaded buffer
   */
  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    filename: string,
    contentType: string
  ): Promise<string | null> {
    const key = `${folder}/${filename}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        })
      );
      return key;
    } catch (e) {
      console.error(`Error uploading file ${key} to S3: ${e}`);
      return null;
    }
  }

  /**
   * Delete a file from S3
   * @param key the key of the file to delete
   */
  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  /**
   * Get a file stream from S3
   * @param key the key of the file to get
   * @returns the file stream
   */
  async getFileStream(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.s3.send(command);
    return response.Body as Readable;
  }
}
