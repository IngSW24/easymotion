import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { EmailDto } from './dto/email.dto';
import { PasswordUpdateDto } from './dto/password-update.dto';
import { PasswordChangeDto } from './dto/password-change.dto';
import { OtpLoginDto } from './dto/otp-login.dto';
import { EmailConfirmDto } from './dto/email-confirm.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiResponse, IntersectionType } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { DateTime } from 'luxon';
import { RefreshGuard } from './guards/refresh.guard';
import { AuthUserDto } from './dto/auth-user.dto';
import { AccessTokenDto } from './dto/access-token.dto';
import UseAuth from './decorators/auth-with-role.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private setRefreshTokenCookie(res: any, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      expires: DateTime.now().plus({ days: 5 }).toJSDate(),
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: IntersectionType(AccessTokenDto, AuthUserDto),
  })
  async login(@Req() req, @Res() res): Promise<void> {
    const [user, refresh] = await this.authService.login(req.user);

    this.setRefreshTokenCookie(res, refresh.refreshToken);

    res.send(user);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  @ApiResponse({ type: AccessTokenDto })
  async refresh(@Req() req, @Res() res) {
    const [user, refresh] = await this.authService.refresh(req.user.sub);

    this.setRefreshTokenCookie(res, refresh.refreshToken);

    res.send(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup/customer')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.userSignUp(signUpDto);
  }

  @Post('password')
  requestPasswordReset(@Body() resetPasswordRequestDto: EmailDto) {
    return this.authService.requestResetPassword(resetPasswordRequestDto);
  }

  @Post('password/update')
  updatePassword(@Body() passwordUpdateDto: PasswordUpdateDto) {
    return this.authService.updatePassword(passwordUpdateDto);
  }

  @UseAuth()
  @Post('password/change')
  changePassword(@Req() req, @Body() passwordChangeDto: PasswordChangeDto) {
    const userId = req.user.sub;
    return this.authService.changePassword(userId, passwordChangeDto);
  }

  @UseAuth()
  @Put('otp')
  switchOtp(@Req() req, @Query() value: string) {
    const userId = req.user.sub;
    return this.authService.switchTwoFactorEnabled(userId, {
      enabled: value === 'true',
    });
  }

  @Post('login/otp')
  signInOtp(@Body() otpLoginDto: OtpLoginDto) {
    return this.authService.signInOtp(otpLoginDto);
  }

  @UseAuth()
  @Post('email')
  requestEmailUpdate(@Req() req, @Body() emailDto: EmailDto) {
    const userId = req.user.sub;
    return this.authService.requestEmailUpdate(userId, emailDto);
  }

  @Put('email')
  confirmEmailUpdate(@Body() emailConfirmDto: EmailConfirmDto) {
    return this.authService.confirmEmail(emailConfirmDto);
  }
}
