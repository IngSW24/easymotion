import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserManager } from "src/users/user.manager";
import { EmailService } from "src/email/email.service";
import { JwtService } from "@nestjs/jwt";
import { AuthUserDto } from "./dto/auth-user/auth-user.dto";
import { PhysiotherapistDto } from "src/users/dto/physiotherapist/physiotherapist.dto";
import jwtConfig from "src/config/jwt.config";
import frontendConfig from "src/config/frontend.config";
import IAssetsService, { ASSETS_SERVICE } from "src/assets/assets.interface";
import { MockAssetsService } from "src/assets/implementations/mock.service";
import { ActivityLevel, Sex } from "@prisma/client";
import { CompressionService } from "src/assets/utilities/compression.service";
describe("AuthService - validateUser", () => {
  let service: AuthService;
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
        AuthService,
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

    service = module.get<AuthService>(AuthService);
  });

  it("should return null if user does not exist", async () => {
    userManagerMock.getUserByEmail = jest
      .fn()
      .mockResolvedValue({ success: false });

    const result = await service.validateUser("test@example.com", "password");
    expect(result).toBeNull();
    expect(userManagerMock.getUserByEmail).toHaveBeenCalledWith(
      "test@example.com",
      undefined
    );
  });

  it("should return null if user cannot login", async () => {
    userManagerMock.getUserByEmail = jest.fn().mockResolvedValue({});
    userManagerMock.canUserLogin = jest.fn().mockReturnValue(false);

    const result = await service.validateUser("test@example.com", "password");
    expect(result).toBeNull();
    expect(userManagerMock.canUserLogin).toHaveBeenCalledWith({});
  });

  it("should return null if password is invalid", async () => {
    userManagerMock.getUserByEmail = jest
      .fn()
      .mockResolvedValue({ success: true, data: {} });
    userManagerMock.canUserLogin = jest.fn().mockReturnValue(true);
    userManagerMock.verifyPassword = jest.fn().mockResolvedValue(false);

    const result = await service.validateUser("test@example.com", "password");
    expect(result).toBeNull();
    expect(userManagerMock.verifyPassword).toHaveBeenCalledWith(
      undefined,
      "password"
    );
  });

  it("should return user if validation succeeds", async () => {
    const mockUser = { passwordHash: "hash" };
    userManagerMock.getUserByEmail = jest
      .fn()
      .mockResolvedValue({ success: true, data: mockUser });
    userManagerMock.canUserLogin = jest.fn().mockReturnValue(true);
    userManagerMock.verifyPassword = jest.fn().mockResolvedValue(true);

    const result = await service.validateUser("test@example.com", "password");
    expect(result).toBeDefined();
    expect(result).toMatchObject({}); // Personalizza questo controllo per il tuo DTO
  });

  it("should generate an OTP code and send an email", async () => {
    const userId = "user123";
    const email = "test@example.com";
    const otpCode = "123456";

    // Mock della generazione del codice OTP
    userManagerMock.generateOtpCode = jest.fn().mockResolvedValue(otpCode);

    // Esegui il metodo `sendOtpCode`
    await service.sendOtpCode(userId, email);

    // Verifica che `generateOtpCode` sia stato chiamato con l'ID utente corretto
    expect(userManagerMock.generateOtpCode).toHaveBeenCalledWith(userId);

    // Verifica che `sendEmail` sia stato chiamato con i parametri corretti
    expect(emailServiceMock.sendEmail).toHaveBeenCalledWith(
      email,
      "Effettua il login in EasyMotion",
      `Il tuo codice di verifica per accedere ad EasyMotion è ${otpCode}`
    );
  });

  it("should return null if the user is not found", async () => {
    userManagerMock.getUserById = jest.fn().mockRejectedValue(new Error());

    await expect(
      service.getAuthResponseFromUserId("user123")
    ).rejects.toThrow();
  });

  it("should return a valid AuthResponseDto for a valid user", async () => {
    const mockUser = { id: "user123", firstName: "Test User" };
    userManagerMock.getUserById = jest.fn().mockResolvedValue(mockUser);

    const result = await service.getAuthResponseFromUserId("user123");
    expect(result).toBeDefined();
    expect(result.user).toMatchObject(mockUser); // Personalizza in base al tuo DTO
  });

  it("should generate tokens and return a valid AuthResponseDto", async () => {
    const mockUser: AuthUserDto = {
      id: "user123",
      firstName: "Test User",
      picturePath: null,
      lastName: "Test surname",
      birthDate: "",
      email: "",
      middleName: "",
      phoneNumber: "",
      role: "USER",
      isEmailVerified: false,
      twoFactorEnabled: false,
      physiotherapist: {
        bio: "",
        specialization: "",
        publicPhoneNumber: "",
        publicEmail: "",
        publicAddress: "",
        website: "",
        socialMediaLinks: [],
        user: undefined,
        userId: "",
      } as PhysiotherapistDto,
      patient: {
        sex: Sex.MALE,
        height: 0,
        weight: 0,
        smoker: false,
        activityLevel: ActivityLevel.LOW,
        mobilityLevel: "LIMITED",
        restingHeartRate: 0,
        bloodPressure: "",
        lastMedicalCheckup: undefined,
        notes: "",
        userId: "",
        alcoholUnits: 0,
        profession: "",
        sport: "",
        sportFrequency: 0,
        medications: "",
        allergies: "",
        otherPathologies: "",
        painZone: "",
        painIntensity: 0,
        painFrequency: "",
        painCharacteristics: "",
        painModifiers: "",
        sleepHours: 8,
        perceivedStress: 0,
        personalGoals: "",
      },
    };
    jwtServiceMock.sign = jest.fn().mockImplementation(() => "mock-token");

    const result = await service.getAuthResponseFromUser(mockUser);
    expect(userManagerMock.setLastLogin).toHaveBeenCalledWith(mockUser.id);
    expect(userManagerMock.clearFailedLoginAttempts).toHaveBeenCalledWith(
      mockUser.id
    );
    expect(result.tokens.accessToken).toBe("mock-token");
    expect(result.tokens.refreshToken).toBe("mock-token");
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
