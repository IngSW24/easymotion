import { BadRequestException, Inject } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  isSuccessResult,
  resultToHttpException,
} from 'src/common/types/result';
import { UserManager } from 'src/users/user.manager';
import { SignUpDto } from './dto/actions/sign-up.dto';
import { Prisma } from '@prisma/client';
import { EmailDto } from './dto/actions/email.dto';
import { PasswordUpdateDto } from './dto/actions/password-update.dto';
import { PasswordChangeDto } from './dto/actions/password-change.dto';
import { OtpSwitchDto } from './dto/actions/otp-switch.dto';
import { OtpLoginDto } from './dto/actions/otp-login.dto';
import { EmailService } from 'src/email/email.service';
import { EmailConfirmDto } from './dto/actions/email-confirm.dto';
import { plainToInstance } from 'class-transformer';
import { AuthUserDto } from './dto/auth-user/auth-user.dto';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { JwtPayloadDto } from './dto/auth-user/jwt-payload.dto';
import { UpdateAuthUserDto } from './dto/auth-user/update-auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userManager: UserManager,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(jwtConfig.KEY)
    private readonly configService: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Validates a user's credentials in order to allow login.
   * @param email the email of the user
   * @param password the password of the user
   * @returns the user if the credentials are valid, otherwise null
   */
  async validateUser(email: string, password: string) {
    const result = await this.userManager.getUserByEmail(email);

    if (!isSuccessResult(result)) {
      return null;
    }

    const user = result.data;

    if (!this.userManager.canUserLogin(user)) {
      return null;
    }

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

  /**
   * Logs the current user in by generating an access token and a refresh token.
   * Assumes the user has already been validated.
   * @param user the user to log in
   * @returns a tuple containing the user (with access token) and the refresh token
   */
  async login(user: AuthUserDto) {
    await this.userManager.setLastLogin(user.id);
    await this.userManager.clearFailedLoginAttempts(user.id);
    return this.getLoginResponse(user);
  }

  /**
   * Creates a login response for the user containing an access token and a refresh token
   * together with user information.
   * @param user the user to create the response for
   * @returns a tuple containing the user and the refresh token
   */
  private async getLoginResponse(user: AuthUserDto) {
    const payload = JwtPayloadDto.fromUser(user).toObject();

    return [
      {
        accessToken: this.jwtService.sign(payload),
        ...user,
      },
      {
        refreshToken: this.jwtService.sign(
          { sub: user.id },
          {
            expiresIn: this.configService.refreshExpiresIn,
          },
        ),
      },
    ];
  }

  /**
   * Refereshes the access token of the user.
   * @param user the user to refresh the token for
   * @returns a tuple containing the new access token and the refresh token
   */
  async refresh(userId: string) {
    const result = await this.userManager.getUserById(userId);

    if (!isSuccessResult(result)) {
      return null;
    }

    const user = plainToInstance(AuthUserDto, result.data, {
      excludeExtraneousValues: true,
    });

    return this.getLoginResponse(user);
  }

  /**
   * Fetches the user profile for the given user ID.
   * @param userId the ID of the user to fetch the profile for
   * @returns the user profile as an AuthUserDto
   */
  async getUserProfile(userId: string) {
    const result = await this.userManager.getUserById(userId);
    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }

    return plainToInstance(AuthUserDto, result.data, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Updates the user profile for the given user ID.
   * @param userId the ID of the user to update the profile for
   * @param updateAuthUserDto the updated user profile
   * @returns the updated user profile as an AuthUserDto
   */
  async updateUserProfile(
    userId: string,
    updateAuthUserDto: UpdateAuthUserDto,
  ) {
    const result = await this.userManager.updateUser(userId, updateAuthUserDto);

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }

    return plainToInstance(AuthUserDto, result.data, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Deletes the user profile for the given user ID.
   * @param userId the ID of the user to delete the profile for
   */
  async deleteUserProfile(userId: string) {
    const result = await this.userManager.deleteUser(userId);

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }
  }

  /**
   * Handles the user registration process.
   * @param signUpDto - The data transfer object containing the user's registration details.
   * @returns A promise that resolves when the user is successfully registered.
   * @throws BadRequestException if password and repeated password not correspond.
   * @throws ConflictException if the user creation fails
   */
  async customerSignup(signUpDto: SignUpDto): Promise<void> {
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
        "Password and repeated password don't correspond",
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
      'Finish sign up',
      `Email verification token is ${emailToken}. User id is ${result.data.id}. Email is ${email}`,
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

  /**
   * Set the two-factor authentication status (enabled/disabled) for a user.
   * @param userId - The unique identifier of the user to update.
   * @param otpSwitchDto - The data transfer object containing the new two-factor status.
   * @returns A promise that resolves with the new two-factor status.
   */
  async switchTwoFactorEnabled(
    userId: string,
    otpSwitchDto: OtpSwitchDto,
  ): Promise<OtpSwitchDto> {
    const currentStatus = await this.userManager.setTwoFactorEnabled(
      userId,
      otpSwitchDto.enabled,
    );

    return { enabled: currentStatus };
  }

  /**
   * Second login step with one time password which is required for users with
   * two-factor authentication enabled.
   * @param otpLoginDto - The data transfer object containing the user's OTP.
   * @returns A promise that resolves with the user and the refresh token.
   */
  async signInOtp(otpLoginDto: OtpLoginDto) {
    const { userId, otp } = otpLoginDto;

    const user = await this.getUserByIdOrThrow(userId);

    const result = await this.userManager.validateTwoFactor(user.id, otp);

    if (!result) {
      throw new UnauthorizedException('Invalid OTP');
    }

    return this.getLoginResponse(user);
  }

  /**
   * Request to update the email address of a user.
   * @param userId The unique identifier of the user to update.
   * @param emailDto The data transfer object containing the new email address.
   */
  async requestEmailUpdate(userId: string, emailDto: EmailDto) {
    const user = await this.getUserByIdOrThrow(userId);
    const token = await this.userManager.generateEmailConfirmationToken(
      user.id,
    );

    await this.emailService.sendEmail(
      emailDto.email,
      'Email verification',
      `Email verification token is ${token}. User id is ${user.id}`,
    );
  }

  /**
   * Confirm the email address update for a user.
   * @param emailConfirmDto The data transfer object containing the user ID, token, and new email.
   */
  async confirmEmail(emailConfirmDto: EmailConfirmDto) {
    const user = await this.getUserByIdOrThrow(emailConfirmDto.userId);

    const result = await this.userManager.resetEmail(
      user.id,
      emailConfirmDto.token,
      emailConfirmDto.email,
    );

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }
  }

  /**
   * Retrieves a user by their unique identifier or throws an exception if any error occours.
   * @param userId The unique identifier of the user to retrieve.
   * @returns A promise that resolves with the user if found.
   */
  private async getUserByIdOrThrow(userId: string) {
    const user = await this.userManager.getUserById(userId);

    if (!isSuccessResult(user)) {
      throw resultToHttpException(user);
    }

    return user.data;
  }
}
