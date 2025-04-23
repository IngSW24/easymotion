import { registerAs } from "@nestjs/config";

const DEFAULT_MAX_IMAGE_SIZE = 500000;
const DEFAULT_IMAGE_COMPRESSION_FACTOR = 0.2;

export default registerAs("assets", () => ({
  useS3: process.env.USE_S3 === "true",
  maxImageSize: +process.env.MAX_IMAGE_SIZE || DEFAULT_MAX_IMAGE_SIZE,
  imageCompressionFactor:
    +process.env.IMAGE_COMPRESSION_FACTOR || DEFAULT_IMAGE_COMPRESSION_FACTOR,
}));
