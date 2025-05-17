import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Req,
  ParseFilePipeBuilder,
  Res,
  SerializeOptions,
  UploadedFile,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ApiOkResponse } from "@nestjs/swagger";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";
import { AuthUserDto } from "src/auth/dto/auth-user/auth-user.dto";
import { UpdateAuthUserDto } from "src/auth/dto/auth-user/update-auth-user.dto";
import { ApiFileBody } from "src/common/decorators/api-file-body.decorator";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Retrieves the profile of the currently authenticated user.
   * @param req The request object, containing the user's ID.
   */
  @UseAuth()
  @Get()
  @ApiOkResponse({ type: AuthUserDto })
  @SerializeOptions({ type: AuthUserDto })
  getUserProfile(@Req() req) {
    // this returns an User that will be converted into a AuthUser
    return this.profileService.getUserProfile(req.user.sub);
  }

  /**
   * Updates the profile of the currently authenticated user.
   * @param req The request object, containing the user's ID.
   * @param updateProfileDto The data to update the user's profile.
   */
  @UseAuth()
  @Put()
  @ApiOkResponse({ type: AuthUserDto })
  @SerializeOptions({ type: AuthUserDto })
  updateUserProfile(@Req() req, @Body() updateProfileDto: UpdateAuthUserDto) {
    return this.profileService.updateUserProfile(
      req.user.sub,
      updateProfileDto
    );
  }

  /**
   * Deletes the profile of the currently authenticated user.
   * @param req The request object, containing the user's ID.
   * @param res The response object.
   */
  @UseAuth()
  @Delete()
  @ApiOkResponse()
  async deleteUserProfile(@Req() req, @Res() res) {
    this.clearRefreshTokenCookie(res);
    await this.profileService.deleteUserProfile(req.user.sub);
  }

  /**
   * Updates the profile picture of the currently authenticated user.
   * @param req The request object, containing the user's ID.
   * @param file The file to update the profile picture with.
   */
  @UseAuth()
  @Post("picture")
  @ApiOkResponse({ type: AuthUserDto })
  @SerializeOptions({ type: AuthUserDto })
  @ApiFileBody()
  async updateProfilePicture(
    @Req() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 10 })
        .addFileTypeValidator({ fileType: "image" })
        .build()
    )
    file: Express.Multer.File
  ) {
    const userId = req.user.sub;

    return this.profileService.updateUserPicture(
      userId,
      file.buffer,
      file.mimetype
    );
  }

  /**
   * Clears the refresh token cookie.
   * @param res The response object.
   */
  private clearRefreshTokenCookie(res: any) {
    res.clearCookie("refreshToken");
  }
}
