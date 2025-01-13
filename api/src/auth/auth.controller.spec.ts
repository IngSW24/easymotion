import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserManager } from 'src/users/user.manager';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'nestjs-prisma';

describe('AuthController', () => {
  let controller: AuthController;
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
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(), // Mock the `sendEmail` method
          },
        },
        {
          provide: 'CONFIGURATION(jwt)',
          useValue: {
            secret: 'test-secret',
            expiresIn: '1h',
            audience: 'test-audience',
            issuer: 'test-issuer',
            refreshExpiresIn: '7d',
          },
        },
        {
          provide: PrismaService, // Use the actual PrismaService class
          useValue: mockPrismaClient, // Inject the mock implementation
        },
        {
          provide: 'CONFIGURATION(jwt)',
          useValue: {
            secret: 'test-secret',
            expiresIn: '1h',
            audience: 'test-audience',
            issuer: 'test-issuer',
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
