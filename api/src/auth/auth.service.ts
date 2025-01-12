import { BadRequestException } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  isSuccessResult,
  resultToHttpException,
} from 'src/common/types/result';
import { UserManager } from 'src/users/user.manager';
import { SignUpDto } from './dto/sign-up.dto';
import { Prisma } from '@prisma/client';
import { EmailDto } from './dto/email.dto';
import { PasswordUpdateDto } from './dto/password-update.dto';
import { PasswordChangeDto } from './dto/password-change.dto';
import { OtpSwitchDto } from './dto/otp-switch.dto';
import { OtpLoginDto } from './dto/otp-login.dto';
import { EmailService } from 'src/email/email.service';
import { EmailConfirmDto } from './dto/email-confirm.dto';
import { plainToInstance } from 'class-transformer';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userManager: UserManager,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string) {
    const result = await this.userManager.getUserByEmail(email);

    if (!isSuccessResult(result)) {
      return null;
    }

    const user = result.data;

    const isValidPwd = await this.userManager.verifyPassword(
      user.passwordHash,
      password,
    );

    if (!isValidPwd) {
      return null;
    }

    return plainToInstance(AuthUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async login(user: AuthUserDto) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Handles the user registration process.
   * @param signUpDto - The data transfer object containing the user's registration details.
   * @returns A promise that resolves when the user is successfully registered.
   * @throws BadRequestException if password and repeated password not correspond.
   * @throws ConflictException if the user creation fails
   */
  async userSignUp(signUpDto: SignUpDto): Promise<void> {
    const {
      email,
      password,
      repeatedPassword,
      username,
      firstName,
      middleName,
      lastName,
      phoneNumber,
      birthDate,
    } = signUpDto;

    const newUser: Prisma.ApplicationUserCreateInput = {
      email,
      username,
      firstName,
      middleName: middleName || null,
      lastName,
      phoneNumber: phoneNumber || null,
      birthDate: birthDate || null,
      role: 'USER',
    };

    if (password !== repeatedPassword) {
      throw new BadRequestException(
        'Password and repeated password not correspond',
      );
    }

    const result = await this.userManager.createUser(newUser, password);

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }

    const emailToken = await this.userManager.generateEmailConfirmationToken(
      result.data.id,
    );

    await this.emailService.sendEmail(
      email,
      'Email verification',
      `Email verification token is ${emailToken}`,
    );
  }

  /**
   * Changes the password for a user.
   * @param userId - The unique identifier of the user whose password is to be changed.
   * @param oldPassword - The current password of the user.
   * @param newPassword - The new password to set for the user.
   * @returns A promise that resolves with no value if the password change is successful.
   * @throws NotFoundException if the user is not found.
   * @throws UnauthorizedException if the old password is incorrect.
   * @throws BadRequestException if the new password does not meet the required criteria.
   */
  async changePassword(
    userId: string,
    passwordChangeDto: PasswordChangeDto,
  ): Promise<void> {
    const user = await this.getUserByIdOrThrow(userId);

    const { oldPassword, newPassword } = passwordChangeDto;

    const result = await this.userManager.changePassword(
      user.id,
      oldPassword,
      newPassword,
    );

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }
  }

  /**
   * Initiates a password reset process for a user.
   * @param email - The email address of the user requesting a password reset.
   * @returns A promise that resolves with no value if the request is successful.
   * @throws NotFoundException if the user is not found.
   * @throws InternalServerErrorException if the password reset token cannot be generated.
   */
  async requestResetPassword(requestDto: EmailDto): Promise<void> {
    const user = await this.userManager.getUserByEmail(requestDto.email);

    if (!isSuccessResult(user)) {
      return; // no exception thrown if user not found to prevent user enumeration
    }

    const resetToken = await this.userManager.generatePasswordResetToken(
      user.data.id,
    );

    await this.emailService.sendEmail(
      user.data.email,
      'Email reset token',
      `Reset token is ${resetToken}`,
    );
  }

  /**
   * Resets the password for a user using a reset token.
   * @param email - The email address of the user resetting their password.
   * @param resetRequestToken - The token sent to the user for password reset verification.
   * @param newPassword - The new password to set for the user.
   * @returns A promise that resolves with no value if the reset is successful.
   * @throws NotFoundException if the user is not found.
   * @throws UnauthorizedException if the reset token is invalid or expired.
   * @throws BadRequestException if the new password does not meet the required criteria.
   */
  async updatePassword(passwordUpdateDto: PasswordUpdateDto): Promise<void> {
    const { userId, token, newPassword } = passwordUpdateDto;
    const user = await this.getUserByIdOrThrow(userId);

    const result = await this.userManager.resetPassword(
      user.id,
      token,
      newPassword,
    );

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }
  }

  async switchTwoFactorEnabled(
    userId: string,
    otpSwitchDto: OtpSwitchDto,
  ): Promise<OtpSwitchDto> {
    const currentStatus = await this.userManager.setTwoFactor(
      userId,
      otpSwitchDto.enabled,
    );

    return { enabled: currentStatus };
  }

  async signInOtp(otpLoginDto: OtpLoginDto) {
    const { userId, otp } = otpLoginDto;

    const user = await this.getUserByIdOrThrow(userId);

    const result = await this.userManager.validateTwoFactor(user.id, otp);

    if (!result) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // TODO: should be extracted to a separate method
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async requestEmailUpdate(userId: string, emailDto: EmailDto) {
    const user = await this.getUserByIdOrThrow(userId);
    const token = this.userManager.generateEmailConfirmationToken(user.id);

    await this.emailService.sendEmail(
      emailDto.email,
      'Email verification',
      `Email verification token is ${token}`,
    );
  }

  async confirmEmail(userId: string, emailConfirmDto: EmailConfirmDto) {
    const user = await this.getUserByIdOrThrow(userId);

    const result = await this.userManager.changeEmail(
      user.id,
      emailConfirmDto.token,
      emailConfirmDto.email,
    );

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }
  }

  private async getUserByIdOrThrow(userId: string) {
    const user = await this.userManager.getUserById(userId);

    if (!isSuccessResult(user)) {
      throw resultToHttpException(user);
    }

    return user.data;
  }
}
