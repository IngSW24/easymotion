import {
  applyDecorators,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/actions/sign-up.dto";
import { EmailDto } from "./dto/actions/email.dto";
import { PasswordUpdateDto } from "./dto/actions/password-update.dto";
import { PasswordChangeDto } from "./dto/actions/password-change.dto";
import { OtpLoginDto } from "./dto/actions/otp-login.dto";
import { EmailConfirmDto } from "./dto/actions/email-confirm.dto";
import { ApiBody, ApiOkResponse, ApiResponse } from "@nestjs/swagger";
import { SignInDto } from "./dto/actions/sign-in.dto";
import { DateTime } from "luxon";
import { RefreshGuard } from "./guards/refresh.guard";
import UseAuth from "./decorators/auth-with-role.decorator";
import { UpdateAuthUserDto } from "./dto/auth-user/update-auth-user.dto";
import AuthFlowHeader from "./decorators/authflow-header.decorator";
import { CustomRequest } from "src/common/types/custom-request";
import { RefreshTokenDto } from "./dto/actions/refresh-token.dto";
import { OtpGuard } from "./guards/otp.guard";
import {
  AdminLocalAuthGuard,
  UserLocalAuthGuard,
} from "./guards/local-auth.guard";
import { AuthResponseDto } from "./dto/auth-user/auth-response.dto";
import { ApiFileBody } from "src/common/decorators/api-file-body.decorator";
import IAssetsService, { ASSETS_SERVICE } from "src/assets/assets.interface";
import { CompressionService } from "src/assets/utilities/compression.service";
import { ApplicationUserDto } from "src/users/dto/user/application-user.dto";

// avoids having to bloat the code with the same multiple decorators
const ApiLoginResponse = (description: string = "Successful login") =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description,
      type: AuthResponseDto,
    }),
    AuthFlowHeader()
  );

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly imageCompressionService: CompressionService,
    @Inject(ASSETS_SERVICE) private readonly assetsService: IAssetsService
  ) {}

  private async login(req: CustomRequest, res: any) {
    if (req.user.requiresOtp) {
      res.send(
        new AuthResponseDto({
          user: null,
          tokens: null,
          requiresOtp: true,
        })
      );
      return;
    }

    const authResponse = await this.authService.getAuthResponseFromUserId(
      req.user.id
    );
    this.sendAuthenticationTokens(req, res, authResponse);
  }

  /**
   * Logs in a user and sets the refresh token cookie.
   * @param req The request object, containing the authenticated user.
   * @param res The response object.
   */
  @UseGuards(UserLocalAuthGuard)
  @Post("login")
  @ApiBody({ type: SignInDto })
  @ApiLoginResponse()
  async userLogin(@Req() req: CustomRequest, @Res() res) {
    this.login(req, res);
  }

  /**
   * Logs in an admin user and sets the refresh token cookie.
   * @param req The request object, containing the authenticated user.
   * @param res The response object.
   */
  @UseGuards(AdminLocalAuthGuard)
  @Post("login/admin")
  @ApiBody({ type: SignInDto })
  @ApiLoginResponse()
  async adminLogin(@Req() req: CustomRequest, @Res() res) {
    this.login(req, res);
  }

  /**
   * Executes the OTP login stage.
   * @param req The request object.
   * @param res The response object
   */
  @UseGuards(OtpGuard)
  @Post("login/otp")
  @ApiLoginResponse()
  @ApiBody({ type: OtpLoginDto })
  async loginOtp(@Req() req: CustomRequest, @Res() res) {
    const loginResponse = await this.authService.getAuthResponseFromUserId(
      req.user.id
    );
    this.sendAuthenticationTokens(req, res, loginResponse);
  }

  /**
   * Refreshes the user's access token and sets a new refresh token cookie.
   * @param req The request object, containing the user's ID.
   * @param res The response object.
   */
  @UseGuards(RefreshGuard)
  @Post("refresh")
  @ApiLoginResponse("Token refreshed successfully")
  @ApiBody({ type: RefreshTokenDto, required: false })
  async refresh(@Req() req: CustomRequest, @Res() res) {
    const response = await this.authService.getAuthResponseFromUserId(
      req.user.sub
    );
    this.sendAuthenticationTokens(req, res, response);
  }

  /**
   * Logs out the user by clearing the refresh token cookie.
   * @param res The response object.
   */
  @Post("logout")
  @UseAuth()
  async logout(@Res() res) {
    this.clearRefreshTokenCookie(res);
    res.sendStatus(200);
  }

  /**
   * Retrieves the profile of the currently authenticated user.
   * @param req The request object, containing the user's ID.
   */
  @UseAuth()
  @Get("profile")
  getUserProfile(@Req() req) {
    return this.authService.getUserProfile(req.user.sub);
  }

  /**
   * Updates the profile of the currently authenticated user.
   * @param req The request object, containing the user's ID.
   * @param updateProfileDto The data to update the user's profile.
   */
  @UseAuth()
  @Put("profile")
  updateUserProfile(@Req() req, @Body() updateProfileDto: UpdateAuthUserDto) {
    return this.authService.updateUserProfile(req.user.sub, updateProfileDto);
  }

  /**
   * Deletes the profile of the currently authenticated user.
   * @param req The request object, containing the user's ID.
   * @param res The response object.
   */
  @UseAuth()
  @Delete("profile")
  async deleteUserProfile(@Req() req, @Res() res) {
    this.clearRefreshTokenCookie(res);
    await this.authService.deleteUserProfile(req.user.sub);
  }

  /**
   * Updates the profile picture of the currently authenticated user.
   * @param req The request object, containing the user's ID.
   * @param file The file to update the profile picture with.
   */
  @UseAuth()
  @Post("profile/picture")
  @ApiOkResponse({ type: ApplicationUserDto })
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

    const compressedBuffer = await this.imageCompressionService.compressImage(
      file.buffer
    );

    return this.authService.updateUserPicture(
      userId,
      compressedBuffer,
      file.mimetype
    );
  }

  /**
   * Registers a new customer account.
   * @param signUpDto The data for creating the new account.
   */
  @HttpCode(HttpStatus.OK)
  @Post("signup/customer")
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.customerSignup(signUpDto);
  }

  /**
   * Requests a password reset for a user.
   * @param resetPasswordRequestDto The email of the user requesting a reset.
   */
  @Post("password")
  requestPasswordReset(@Body() resetPasswordRequestDto: EmailDto) {
    return this.authService.requestResetPassword(resetPasswordRequestDto);
  }

  /**
   * Updates the password for a user.
   * @param passwordUpdateDto The data to update the password.
   */
  @Post("password/update")
  updatePassword(@Body() passwordUpdateDto: PasswordUpdateDto) {
    return this.authService.updatePassword(passwordUpdateDto);
  }

  /**
   * Changes the password for the currently authenticated user.
   * @param req The request object, containing the user's ID.
   * @param passwordChangeDto The data to change the password.
   */
  @UseAuth()
  @Post("password/change")
  changePassword(@Req() req, @Body() passwordChangeDto: PasswordChangeDto) {
    const userId = req.user.sub;
    return this.authService.changePassword(userId, passwordChangeDto);
  }

  /**
   * Enables or disables two-factor authentication for the user.
   * @param req The request object, containing the user's ID.
   * @param value The value to enable or disable two-factor authentication.
   */
  @UseAuth()
  @Put("otp")
  switchOtp(@Req() req, @Query("value") value: string) {
    const userId = req.user.sub;
    return this.authService.switchTwoFactorEnabled(userId, value === "true");
  }

  /**
   * Requests an email update for the currently authenticated user.
   * @param req The request object, containing the user's ID.
   * @param emailDto The new email address.
   */
  @UseAuth()
  @Post("email")
  requestEmailUpdate(@Req() req, @Body() emailDto: EmailDto) {
    const userId = req.user.sub;
    return this.authService.requestEmailUpdate(userId, emailDto);
  }

  /**
   * Confirms an email update for the user.
   * @param emailConfirmDto The email confirmation data.
   * @param res The response object.
   */
  @Put("email")
  @ApiLoginResponse("Email confirmed successfully")
  async confirmEmail(@Req() req, @Res() res, @Body() confirm: EmailConfirmDto) {
    const response = await this.authService.confirmEmail(confirm);
    this.sendAuthenticationTokens(req, res, response);
  }

  /**
   * Sends the authentication tokens to the client.
   * @param req the request object
   * @param res the response object
   * @param loginResponse the login response obtained by the auth service
   */
  private sendAuthenticationTokens(
    req: CustomRequest,
    res: { send(data: unknown): never },
    authResponseDto: AuthResponseDto
  ) {
    if (req.isWebAuth) {
      this.setRefreshTokenCookie(res, authResponseDto.tokens.refreshToken);
      authResponseDto.tokens.refreshToken = null;
    }

    res.send(authResponseDto);
  }

  /**
   * Sets the refresh token as an HTTP-only cookie.
   * @param res The response object.
   * @param refreshToken The refresh token to set in the cookie.
   */
  private setRefreshTokenCookie(res: any, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
      expires: DateTime.now().plus({ days: 5 }).toJSDate(),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }

  /**
   * Clears the refresh token cookie.
   * @param res The response object.
   */
  private clearRefreshTokenCookie(res: any) {
    res.clearCookie("refreshToken");
  }
}
