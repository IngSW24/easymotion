import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "src/email/email.service";
import { UsersService } from "src/users/users.service";
import { UserManager } from "src/users/user.manager";
import { PrismaService } from "nestjs-prisma";

describe("AuthService", () => {
  let service: AuthService;

  // Mock Prisma Service
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UsersService,
        UserManager,
        {
          provide: "CONFIGURATION(jwt)",
          useValue: {
            secret: "test-secret",
            expiresIn: "1h",
            audience: "test-audience",
            issuer: "test-issuer",
            refreshExpiresIn: "7d",
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(), // Mock the `sendEmail` method
          },
        },
        {
          provide: PrismaService, // Use the actual PrismaService class
          useValue: mockPrismaClient, // Inject the mock implementation
        },
        {
          provide: "CONFIGURATION(jwt)",
          useValue: {
            secret: "test-secret",
            expiresIn: "1h",
            audience: "test-audience",
            issuer: "test-issuer",
          },
        },
        {
          provide: "CONFIGURATION(frontend)",
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
