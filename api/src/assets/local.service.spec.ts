import { Test, TestingModule } from "@nestjs/testing";
import LocalAssetsService from "./local.service";

describe("LocalAssetsService", () => {
  let service: LocalAssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalAssetsService],
    }).compile();

    service = module.get<LocalAssetsService>(LocalAssetsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should upload a buffer", async () => {
    const buffer = Buffer.from("test");
    const result = await service.uploadBuffer(
      buffer,
      "test",
      "test.png",
      "image/png"
    );
    expect(result).toBeDefined();
  });
});
