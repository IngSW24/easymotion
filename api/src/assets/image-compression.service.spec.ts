import { Test, TestingModule } from "@nestjs/testing";
import assetsConfig from "src/config/assets.config";
import { ImageCompressionService } from "./image-compression.service";

describe("ImageCompressionService", () => {
  let service: ImageCompressionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageCompressionService,
        {
          provide: assetsConfig.KEY,
          useValue: {
            maxImageSize: 1000,
            imageCompressionFactor: 0.5,
          },
        },
      ],
    }).compile();

    service = module.get<ImageCompressionService>(ImageCompressionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
