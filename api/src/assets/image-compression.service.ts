import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import * as sharp from "sharp";
import assetsConfig from "src/config/assets.config";

@Injectable()
export class ImageCompressionService {
  private maxSize: number;
  private compressionFactor: number;

  constructor(
    @Inject(assetsConfig.KEY)
    config: ConfigType<typeof assetsConfig>
  ) {
    this.maxSize = config.maxImageSize;
    this.compressionFactor = config.imageCompressionFactor;
  }

  async compressImage(buffer: Buffer, maxSize?: number): Promise<Buffer> {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (metadata.size && metadata.size > (maxSize ?? this.maxSize)) {
      return image
        .resize({
          width: Math.floor(metadata.width * this.compressionFactor),
          height: Math.floor(metadata.height * this.compressionFactor),
        })
        .toBuffer();
    }

    return buffer;
  }
}
