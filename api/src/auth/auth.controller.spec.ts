import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthResponseDto } from "./dto/auth-user/auth-response.dto";
import { UpdateAuthUserDto } from "./dto/auth-user/update-auth-user.dto";
import { CustomRequest } from "src/common/types/custom-request";
import IAssetsService, { ASSETS_SERVICE } from "src/assets/assets.interface";
import { CompressionService } from "src/assets/utilities/compression.service";
import assetsConfig from "src/config/assets.config";

describe("AuthController", () => {
  let controller: AuthController;
  let serviceMock: Partial<AuthService>;
  let assetsServiceMock: Partial<IAssetsService>;
  let imageCompressionServiceMock: Partial<CompressionService>;

  beforeEach(async () => {
    serviceMock = {
      validateUser: jest.fn(),
      sendOtpCode: jest.fn(),
      getAuthResponseFromUserId: jest.fn(),
      getUserProfile: jest.fn(),
      updateUserProfile: jest.fn(),
      deleteUserProfile: jest.fn(),
      updateUserPicture: jest.fn(),
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
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: serviceMock,
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
          provide: assetsConfig.KEY,
          useValue: {
            maxSize: 1024 * 1024 * 10,
            compressionFactor: 0.5,
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should send OTP response if requiresOtp is true in userLogin", async () => {
    const req: CustomRequest = {
      user: { requiresOtp: true },
      isWebAuth: false,
      cache: "default",
      credentials: "include",
      destination: "",
      headers: undefined,
      integrity: "",
      keepalive: false,
      method: "",
      mode: "same-origin",
      redirect: "error",
      referrer: "",
      referrerPolicy: "",
      signal: undefined,
      url: "",
      clone: function (): Request {
        throw new Error("Function not implemented.");
      },
      body: undefined,
      bodyUsed: false,
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error("Function not implemented.");
      },
      blob: function (): Promise<Blob> {
        throw new Error("Function not implemented.");
      },
      bytes: function (): Promise<Uint8Array> {
        throw new Error("Function not implemented.");
      },
      formData: function (): Promise<FormData> {
        throw new Error("Function not implemented.");
      },
      json: function (): Promise<any> {
        throw new Error("Function not implemented.");
      },
      text: function (): Promise<string> {
        throw new Error("Function not implemented.");
      },
    }; // Simula un utente che necessita dell'OTP
    const res = { send: jest.fn() }; // Mock della risposta

    await controller.userLogin(req, res);

    // Verifica che sia stata inviata la risposta OTP
    expect(res.send).toHaveBeenCalledWith(
      new AuthResponseDto({
        user: null,
        tokens: null,
        requiresOtp: true,
      })
    );
  });

  it("should call getAuthResponseFromUserId and sendAuthenticationTokens for userLogin", async () => {
    const req: CustomRequest = {
      user: { id: "user123", requiresOtp: false },
      isWebAuth: false,
      cache: "default",
      credentials: "include",
      destination: "",
      headers: undefined,
      integrity: "",
      keepalive: false,
      method: "",
      mode: "same-origin",
      redirect: "error",
      referrer: "",
      referrerPolicy: "",
      signal: undefined,
      url: "",
      clone: function (): Request {
        throw new Error("Function not implemented.");
      },
      body: undefined,
      bodyUsed: false,
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error("Function not implemented.");
      },
      blob: function (): Promise<Blob> {
        throw new Error("Function not implemented.");
      },
      bytes: function (): Promise<Uint8Array> {
        throw new Error("Function not implemented.");
      },
      formData: function (): Promise<FormData> {
        throw new Error("Function not implemented.");
      },
      json: function (): Promise<any> {
        throw new Error("Function not implemented.");
      },
      text: function (): Promise<string> {
        throw new Error("Function not implemented.");
      },
    }; // Simula un utente senza OTP richiesto
    const res = { send: jest.fn() }; // Mock della risposta
    const mockAuthResponse = new AuthResponseDto({
      user: {
        id: "user123",
        birthDate: "",
        picturePath: null,
        email: "",
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        sex: "Male",
        role: "USER",
        isEmailVerified: false,
        twoFactorEnabled: false,
      },
      tokens: {
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      },
      requiresOtp: false,
    });

    // Mock del servizio
    serviceMock.getAuthResponseFromUserId = jest
      .fn()
      .mockResolvedValue(mockAuthResponse);

    await controller.userLogin(req, res);

    // Verifica che `getAuthResponseFromUserId` venga chiamato con l'ID corretto
    expect(serviceMock.getAuthResponseFromUserId).toHaveBeenCalledWith(
      "user123"
    );
  });

  it("should behave the same as userLogin for adminLogin", async () => {
    const req: CustomRequest = {
      user: { id: "admin123", requiresOtp: false },
      isWebAuth: false,
      cache: "default",
      credentials: "include",
      destination: "",
      headers: undefined,
      integrity: "",
      keepalive: false,
      method: "",
      mode: "same-origin",
      redirect: "error",
      referrer: "",
      referrerPolicy: "",
      signal: undefined,
      url: "",
      clone: function (): Request {
        throw new Error("Function not implemented.");
      },
      body: undefined,
      bodyUsed: false,
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error("Function not implemented.");
      },
      blob: function (): Promise<Blob> {
        throw new Error("Function not implemented.");
      },
      bytes: function (): Promise<Uint8Array> {
        throw new Error("Function not implemented.");
      },
      formData: function (): Promise<FormData> {
        throw new Error("Function not implemented.");
      },
      json: function (): Promise<any> {
        throw new Error("Function not implemented.");
      },
      text: function (): Promise<string> {
        throw new Error("Function not implemented.");
      },
    }; // Simula un amministratore senza OTP richiesto
    const res = { send: jest.fn() }; // Mock della risposta
    const mockAuthResponse = new AuthResponseDto({
      user: {
        id: "admin123",
        birthDate: "",
        email: "",
        firstName: "Admin 123",
        middleName: "",
        lastName: "",
        picturePath: null,
        phoneNumber: "",
        sex: "Female",
        role: "USER",
        isEmailVerified: false,
        twoFactorEnabled: false,
      },
      tokens: {
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      },
      requiresOtp: false,
    });

    // Mock del servizio
    serviceMock.getAuthResponseFromUserId = jest
      .fn()
      .mockResolvedValue(mockAuthResponse);

    await controller.adminLogin(req, res);

    // Verifica che `getAuthResponseFromUserId` venga chiamato con l'ID corretto
    expect(serviceMock.getAuthResponseFromUserId).toHaveBeenCalledWith(
      "admin123"
    );
  });

  describe("getUserProfile", () => {
    it("should fetch user profile from the service", async () => {
      const req = { user: { sub: "user123" } }; // Simula la richiesta con l'ID dell'utente
      const mockProfile = { id: "user123", name: "Test User" };

      serviceMock.getUserProfile = jest.fn().mockResolvedValue(mockProfile);
      const result = await controller.getUserProfile(req);
      expect(serviceMock.getUserProfile).toHaveBeenCalledWith(req.user.sub);
      expect(result).toEqual(mockProfile);
    });
  });

  describe("updateUserProfile", () => {
    it("should call service to update user profile", async () => {
      const req = { user: { sub: "user123" } }; // Simula la richiesta con l'ID dell'utente
      const mockUpdateDto: UpdateAuthUserDto = { firstName: "Updated User" };
      const mockUpdatedProfile = { id: "user123", firstName: "Updated User" };

      serviceMock.updateUserProfile = jest
        .fn()
        .mockResolvedValue(mockUpdatedProfile);
      const result = await controller.updateUserProfile(req, mockUpdateDto);
      expect(serviceMock.updateUserProfile).toHaveBeenCalledWith(
        req.user.sub,
        mockUpdateDto
      );
      expect(result).toEqual(mockUpdatedProfile);
    });
  });

  it("should clear refresh token cookie and call deleteUserProfile", async () => {
    const req = { user: { sub: "user123" } }; // Simulate the request with the user's ID
    const res = { send: jest.fn(), clearCookie: jest.fn() }; // Mock the response

    await controller.deleteUserProfile(req, res);

    // Verify that the `deleteUserProfile` method of the service is called with the correct ID
    expect(serviceMock.deleteUserProfile).toHaveBeenCalledWith("user123");

    // Ensure the refresh token cookie is cleared
    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
  });
});
