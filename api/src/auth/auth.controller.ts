import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/actions/sign-up.dto";
import { EmailDto } from "./dto/actions/email.dto";
import { PasswordUpdateDto } from "./dto/actions/password-update.dto";
import { PasswordChangeDto } from "./dto/actions/password-change.dto";
import { OtpLoginDto } from "./dto/actions/otp-login.dto";
import { EmailConfirmDto } from "./dto/actions/email-confirm.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { ApiBody, ApiResponse, IntersectionType } from "@nestjs/swagger";
import { SignInDto } from "./dto/actions/sign-in.dto";
import { DateTime } from "luxon";
import { RefreshGuard } from "./guards/refresh.guard";
import { AuthUserDto } from "./dto/auth-user/auth-user.dto";
import { AccessTokenDto } from "./dto/actions/access-token.dto";
import UseAuth from "./decorators/auth-with-role.decorator";
import { UpdateAuthUserDto } from "./dto/auth-user/update-auth-user.dto";
import AuthFlowHeader from "./decorators/authflow-header.decorator";
import { CustomRequest } from "src/common/types/custom-request";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

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

  /**
   * Logs in a user and sets the refresh token cookie.
   * @param req The request object, containing the authenticated user.
   * @param res The response object.
   */
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiBody({ type: SignInDto })
  @AuthFlowHeader()
  @ApiResponse({
    status: 200,
    description: "Successful login",
    type: IntersectionType(AccessTokenDto, AuthUserDto),
  })
  async login(@Req() req: CustomRequest, @Res() res): Promise<void> {
    const twoFactorDiscriminator = await this.authService.login(req.user);

    // needs === false for correct type insertion
    if (twoFactorDiscriminator.requiresOtp === true) {
      res.send({ requiresOtp: true });
      return;
    }

    if (req.isWebAuth) {
      // send refresh token as http only cookie
      this.setRefreshTokenCookie(res, twoFactorDiscriminator.user.refreshToken);
      twoFactorDiscriminator.user.refreshToken = undefined;
      res.send(twoFactorDiscriminator.user);
      return;
    }

    res.send(twoFactorDiscriminator.user);
  }

  @Post("login/otp")
  @AuthFlowHeader()
  @ApiResponse({
    status: 200,
    description: "Successful login",
    type: IntersectionType(AccessTokenDto, AuthUserDto),
  })
  async loginOtp(
    @Body() otpLoginDto: OtpLoginDto,
    @Req() req: CustomRequest,
    @Res() res
  ) {
    const response = await this.authService.loginOtp(otpLoginDto);

    if (req.isWebAuth) {
      this.setRefreshTokenCookie(res, response.user.refreshToken);
      response.user.refreshToken = undefined;
      res.send(response.user);
      return;
    }

    res.send(response.user);
  }

  /**
   * Refreshes the user's access token and sets a new refresh token cookie.
   * @param req The request object, containing the user's ID.
   * @param res The response object.
   */
  @UseGuards(RefreshGuard)
  @AuthFlowHeader()
  @Post("refresh")
  @ApiResponse({
    status: 200,
    type: IntersectionType(AccessTokenDto, AuthUserDto),
  })
  async refresh(@Req() req: CustomRequest, @Res() res) {
    const response = await this.authService.refresh(req.user.sub);

    if (req.isWebAuth) {
      this.setRefreshTokenCookie(res, response.user.refreshToken);
      response.user.refreshToken = undefined;
      res.send(response.user);
      return;
    }

    res.send(response.user);
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
  getUserProfile(@Req() req): Promise<AuthUserDto> {
    return this.authService.getUserProfile(req.user.sub);
  }

  /**
   * Updates the profile of the currently authenticated user.
   * @param req The request object, containing the user's ID.
   * @param updateProfileDto The data to update the user's profile.
   */
  @UseAuth()
  @Put("profile")
  updateUserProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateAuthUserDto
  ): Promise<AuthUserDto> {
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
  switchOtp(@Req() req, @Query() value: string) {
    const userId = req.user.sub;
    return this.authService.switchTwoFactorEnabled(userId, {
      enabled: value === "true",
    });
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
  @AuthFlowHeader()
  @ApiResponse({
    status: 200,
    description: "Email confirmation",
    type: IntersectionType(AccessTokenDto, AuthUserDto),
  })
  async confirmEmail(
    @Body() emailConfirmDto: EmailConfirmDto,
    @Req() req: CustomRequest,
    @Res() res
  ): Promise<void> {
    const response = await this.authService.confirmEmail(emailConfirmDto);

    if (req.isWebAuth) {
      this.setRefreshTokenCookie(res, response.user.refreshToken);
      response.user.refreshToken = undefined;
      res.send(response.user);
      return;
    }

    res.send(response.user);
  }
}
