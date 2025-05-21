import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { UserManager } from "src/users/user.manager";
import { plainToInstance } from "class-transformer";
import { AuthUserDto } from "src/auth/dto/auth-user/auth-user.dto";
import { UpdateAuthUserDto } from "src/auth/dto/auth-user/update-auth-user.dto";
import { DateTime } from "luxon";
import IAssetsService, { ASSETS_SERVICE } from "src/assets/assets.interface";
import { CompressionService } from "src/assets/utilities/compression.service";

@Injectable()
export class ProfileService {
  constructor(
    private userManager: UserManager,
    @Inject(ASSETS_SERVICE)
    private readonly assetsService: IAssetsService,
    private readonly imageCompressionService: CompressionService
  ) {}
  /**
   * Fetches the user profile for the given user ID.
   * @param userId the ID of the user to fetch the profile for
   * @returns the user profile as an UserDto (will be converted by the controller)
   */
  getUserProfile(userId: string) {
    return this.userManager.getUserById(userId);
  }

  /**
   * Updates the user profile for the given user ID.
   * @param userId the ID of the user to update the profile for
   * @param updateAuthUserDto the updated user profile
   * @returns the updated user profile as an AuthUserDto
   */
  async updateUserProfile(
    userId: string,
    updateAuthUserDto: UpdateAuthUserDto
  ): Promise<AuthUserDto> {
    const user = await this.userManager.updateUser(userId, updateAuthUserDto);

    return plainToInstance(AuthUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Deletes the user profile for the given user ID.
   * @param userId the ID of the user to delete the profile for
   */
  async deleteUserProfile(userId: string) {
    return this.userManager.deleteUser(userId);
  }

  /**
   * Updates the user's profile picture path.
   * @param userId the ID of the user to update the profile picture for
   * @param filePath the path of the new profile picture
   * @returns the updated user profile as an AuthUserDto
   */
  async updateUserPicture(
    userId: string,
    buffer: Buffer,
    mimetype: string,
    uniqueTimestamp: string | number | null = null
  ) {
    const user = await this.userManager.getUserById(userId);

    if (user.picturePath) {
      await this.assetsService.deleteFile(user.picturePath);
    }

    const fileName = `${userId}-${!uniqueTimestamp ? DateTime.now().toMillis() : uniqueTimestamp}`;

    const compressedBuffer =
      await this.imageCompressionService.compressImage(buffer);

    const imagePath = await this.assetsService.uploadBuffer(
      compressedBuffer,
      "profile",
      fileName,
      mimetype
    );

    if (!imagePath) {
      throw new BadRequestException("Failed to upload image!");
    }

    const updatedUser = await this.userManager.updateUser(userId, {
      picturePath: imagePath,
    });

    return plainToInstance(AuthUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
