import { Test, TestingModule } from "@nestjs/testing";
import { EmailService } from "./email.service";

describe("EmailService", () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: "CONFIGURATION(smtp)",
          useValue: {
            host: "test-host",
            port: "2525",
            secure: "true",
            user: "test-user",
            pass: "test-pass",
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
