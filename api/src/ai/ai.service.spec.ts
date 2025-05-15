import { Test, TestingModule } from "@nestjs/testing";
import { AiService } from "./ai.service";
import aiConfig from "src/config/ai.config";
import { HttpService } from "@nestjs/axios";

describe("AiService", () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: aiConfig.KEY,
          useValue: {
            ollamaApiKey: "",
            ollamaBaseUrl: "",
            ollamaModel: "",
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
            put: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
