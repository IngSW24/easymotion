import { Test, TestingModule } from "@nestjs/testing";
import { S3AssetsService } from "./s3.service";
import s3Config from "src/config/s3.config";
import { S3_CLIENT } from "src/aws/aws.module";

describe("S3AssetsService", () => {
  let service: S3AssetsService;

  const mockS3Client = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3AssetsService,
        {
          provide: s3Config.KEY,
          useValue: {
            bucket: "test-bucket",
            region: "test-region",
            accessKeyId: "test-access-key-id",
            secretAccessKey: "test-secret-access-key",
          },
        },
        {
          provide: S3_CLIENT,
          useValue: mockS3Client,
        },
      ],
    }).compile();

    service = module.get<S3AssetsService>(S3AssetsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should list buckets", async () => {
    mockS3Client.send.mockResolvedValue({
      Buckets: [{ Name: "test-bucket" }],
    });
    const result = await service.listBuckets();
    expect(mockS3Client.send.mock.calls[0][0].input).toEqual({
      Bucket: "test-bucket",
      Prefix: "",
    });
    expect(result).toBeDefined();
  });
});
