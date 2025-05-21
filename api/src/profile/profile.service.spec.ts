import { Test, TestingModule } from "@nestjs/testing";
import { UserManager } from "src/users/user.manager";
import { EmailService } from "src/email/email.service";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "src/config/jwt.config";
import frontendConfig from "src/config/frontend.config";
import IAssetsService, { ASSETS_SERVICE } from "src/assets/assets.interface";
import { MockAssetsService } from "src/assets/implementations/mock.service";
import { CompressionService } from "src/assets/utilities/compression.service";
import { ProfileService } from "./profile.service";

describe("AuthService - validateUser", () => {
  let service: ProfileService;
  let userManagerMock: Partial<UserManager>;
  let emailServiceMock: Partial<EmailService>;
  let jwtServiceMock: Partial<JwtService>;
  let assetsServiceMock: Partial<IAssetsService>;
  let imageCompressionServiceMock: Partial<CompressionService>;

  beforeEach(async () => {
    userManagerMock = {
      clearFailedLoginAttempts: jest.fn(),
      getUserByEmail: jest.fn(),
      canUserLogin: jest.fn(),
      setLastLogin: jest.fn(),
      verifyPassword: jest.fn(),
    };

    emailServiceMock = {
      sendEmail: jest.fn(), // Mock dell'invio dell'email
    };

    jwtServiceMock = {
      sign: jest.fn(),
    };

    assetsServiceMock = {
      uploadBuffer: jest.fn(),
      deleteFile: jest.fn(),
      getFileStream: jest.fn(),
    };

    imageCompressionServiceMock = {
      compressImage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: UserManager,
          useValue: userManagerMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: ASSETS_SERVICE,
          useValue: assetsServiceMock,
        },
        {
          provide: CompressionService,
          useValue: imageCompressionServiceMock,
        },
        {
          provide: jwtConfig.KEY,
          useValue: {
            secret: "test-secret",
            expiresIn: "1h",
            audience: "test-audience",
            issuer: "test-issuer",
            refreshExpiresIn: "7d",
          },
        },
        {
          provide: frontendConfig.KEY,
          useValue: {},
        },
        {
          provide: EmailService,
          useValue: emailServiceMock,
        },
        {
          provide: ASSETS_SERVICE,
          useClass: MockAssetsService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it("should throw an exception if the user is not found", async () => {
    userManagerMock.getUserById = jest.fn().mockRejectedValue(new Error());

    await expect(service.getUserProfile("user123")).rejects.toThrow();
  });

  it("should return the user profile for a valid user", async () => {
    const mockUser = { id: "user123", firstName: "Test User" };
    userManagerMock.getUserById = jest.fn().mockResolvedValue(mockUser);

    const result = await service.getUserProfile("user123");
    expect(result).toBeDefined();
    expect(result).toMatchObject(mockUser); // Personalizza in base al tuo DTO
  });

  it("should throw an exception if update fails", async () => {
    userManagerMock.updateUser = jest.fn().mockRejectedValue(new Error());

    await expect(
      service.updateUserProfile("user123", { firstName: "Updated User" })
    ).rejects.toThrow();
  });

  it("should return the updated user profile for a valid update", async () => {
    const mockUpdatedUser = { id: "user123", firstName: "Updated User" };
    userManagerMock.updateUser = jest.fn().mockResolvedValue(mockUpdatedUser);

    const result = await service.updateUserProfile("user123", {
      firstName: "Updated User",
    });
    expect(result).toBeDefined();
    expect(result).toMatchObject(mockUpdatedUser);
  });

  it("should call deleteUser with the correct userId", async () => {
    userManagerMock.deleteUser = jest.fn().mockResolvedValue({ success: true });

    await service.deleteUserProfile("user123");
    expect(userManagerMock.deleteUser).toHaveBeenCalledWith("user123");
  });

  it("should update user profile picture", async () => {
    const userId = "user123";
    const buffer = Buffer.from("test");
    const mimeType = "image/jpeg";

    userManagerMock.getUserById = jest
      .fn()
      .mockResolvedValue({ id: userId, picturePath: "path1" });

    userManagerMock.updateUser = jest
      .fn()
      .mockResolvedValue({ id: userId, picturePath: "profile/user123-123" });

    const result = await service.updateUserPicture(
      userId,
      buffer,
      mimeType,
      "123"
    );

    expect(userManagerMock.updateUser).toHaveBeenCalledWith(userId, {
      picturePath: "profile/user123-123",
    });
    expect(result).toBeDefined();
    expect(result.picturePath).toBe("profile/user123-123");
  });
});
