import { Test, TestingModule } from "@nestjs/testing";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { UpdateAuthUserDto } from "src/auth/dto/auth-user/update-auth-user.dto";

describe("AuthController", () => {
  let controller: ProfileController;
  let serviceMock: Partial<ProfileService>;

  beforeEach(async () => {
    serviceMock = {
      getUserProfile: jest.fn(),
      updateUserProfile: jest.fn(),
      deleteUserProfile: jest.fn(),
      updateUserPicture: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
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
