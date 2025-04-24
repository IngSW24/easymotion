import { Test, TestingModule } from "@nestjs/testing";
import assetsConfig from "src/config/assets.config";
import { CompressionService } from "./compression.service";

describe("CompressionService", () => {
  let service: CompressionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompressionService,
        {
          provide: assetsConfig.KEY,
          useValue: {
            maxImageSize: 1000,
            imageCompressionFactor: 0.5,
          },
        },
      ],
    }).compile();

    service = module.get<CompressionService>(CompressionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
