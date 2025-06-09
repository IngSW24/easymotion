import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CustomRequest } from "src/common/types/custom-request";

describe("AuthController", () => {
  let controller: AuthController;
  let serviceMock: Partial<AuthService>;

  beforeEach(async () => {
    serviceMock = {
      validateUser: jest.fn(),
      sendOtpCode: jest.fn(),
      getAuthResponseFromUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: serviceMock,
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
    expect(res.send).toHaveBeenCalledWith({
      user: null,
      tokens: null,
      requiresOtp: true,
    });
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
    const mockAuthResponse = {
      user: {
        id: "user123",
        birthDate: "",
        picturePath: null,
        email: "",
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        role: "USER",
        isEmailVerified: false,
        twoFactorEnabled: false,
      },
      tokens: {
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      },
      requiresOtp: false,
    };

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
    const mockAuthResponse = {
      user: {
        id: "admin123",
        birthDate: "",
        email: "",
        firstName: "Admin 123",
        middleName: "",
        lastName: "",
        picturePath: null,
        phoneNumber: "",
        role: "USER",
        isEmailVerified: false,
        twoFactorEnabled: false,
      },
      tokens: {
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      },
      requiresOtp: false,
    };

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
});
