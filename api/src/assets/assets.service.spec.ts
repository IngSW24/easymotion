import { Test, TestingModule } from "@nestjs/testing";
import { S3AssetsService } from "./s3.service";

describe("AssetsService", () => {
  let service: S3AssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3AssetsService],
    }).compile();

    service = module.get<S3AssetsService>(S3AssetsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
