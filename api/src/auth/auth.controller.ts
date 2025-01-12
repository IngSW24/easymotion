import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
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
import { ApiBody } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: SignInDto })
  login(@Req() req) {
    return this.authService.login(req.user);
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

  @Post('password/change')
  changePassword(
    @Query() userId: string,
    @Body() passwordChangeDto: PasswordChangeDto,
  ) {
    // const userId = '00000000-0000-0000-0000-000000000000'; // TODO: extract from JWT claims
    return this.authService.changePassword(userId, passwordChangeDto);
  }

  @Put('otp')
  switchOtp(@Query() value: string, @Query() userId: string) {
    // const userId = '00000000-0000-0000-0000-000000000000'; // TODO: extract from JWT claims
    return this.authService.switchTwoFactorEnabled(userId, {
      enabled: value === 'true',
    });
  }

  @Post('login/otp')
  signInOtp(@Body() otpLoginDto: OtpLoginDto) {
    return this.authService.signInOtp(otpLoginDto);
  }

  @Post('email')
  requestEmailUpdate(@Query() userId: string, @Body() emailDto: EmailDto) {
    // const userId = '00000000-0000-0000-0000-000000000000'; // TODO: extract from JWT claims
    return this.authService.requestEmailUpdate(userId, emailDto);
  }

  @Put('email')
  confirmEmailUpdate(@Body() emailConfirmDto: EmailConfirmDto) {
    const userId = '00000000-0000-0000-0000-000000000000'; // TODO: extract from JWT claims
    return this.authService.confirmEmail(userId, emailConfirmDto);
  }

  // TODO: Implements change password, request password reset and password reset endpoint / DTO
}
