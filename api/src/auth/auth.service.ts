import { BadRequestException, Inject } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  isSuccessResult,
  resultToHttpException,
} from "src/common/types/result";
import { UserManager } from "src/users/user.manager";
import { SignUpDto } from "./dto/actions/sign-up.dto";
import { Prisma, Role } from "@prisma/client";
import { EmailDto } from "./dto/actions/email.dto";
import { PasswordUpdateDto } from "./dto/actions/password-update.dto";
import { PasswordChangeDto } from "./dto/actions/password-change.dto";
import { OtpLoginDto } from "./dto/actions/otp-login.dto";
import { EmailService } from "src/email/email.service";
import { EmailConfirmDto } from "./dto/actions/email-confirm.dto";
import { plainToInstance } from "class-transformer";
import { AuthUserDto } from "./dto/auth-user/auth-user.dto";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "src/config/jwt.config";
import { JwtPayloadDto } from "./dto/auth-user/jwt-payload.dto";
import { UpdateAuthUserDto } from "./dto/auth-user/update-auth-user.dto";
import {
  generateEmailConfirmMessage,
  generatePasswordResetMessage,
} from "./email-messages/email-confirm.message";
import frontendConfig from "src/config/frontend.config";
import { AuthResponseDto } from "./dto/auth-user/auth-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userManager: UserManager,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(jwtConfig.KEY)
    private readonly configService: ConfigType<typeof jwtConfig>,
    @Inject(frontendConfig.KEY)
    private readonly frontendConfigService: ConfigType<typeof frontendConfig>
  ) {}

  /**
   * Validates a user's credentials in order to allow login.
   * @param email the email of the user
   * @param password the password of the user
   * @returns the user if the credentials are valid, otherwise null
   */
  async validateUser(
    email: string,
    password: string,
    roles: Role[] = undefined
  ) {
    const result = await this.userManager.getUserByEmail(email, roles);

    if (!isSuccessResult(result)) {
      return null;
    }

    const user = result.data;

    if (!this.userManager.canUserLogin(user)) {
      return null;
    }

    const isValidPwd = await this.userManager.verifyPassword(
      user.passwordHash,
      password
    );

    if (!isValidPwd) {
      return null;
    }

    return plainToInstance(AuthUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Generates and sends an OTP code to the user's email.
   * @param userId the ID of the user
   * @param email the email of the user
   * @returns a promise that resolves when the email is sent
   */
  async sendOtpCode(userId: string, email: string) {
    const code = await this.userManager.generateOtpCode(userId);
    await this.emailService.sendEmail(
      email,
      "Effettua il login in EasyMotion",
      `Il tuo codice di verifica per accedere ad EasyMotion è ${code}`
    );
  }

  /**
   * Creates a login response for the user containing an access token and a refresh token
   * together with user information.
   * @param user the user to create the response for
   * @returns a tuple containing the user and the refresh token
   */
  public async getAuthResponseFromUserId(
    userId: string
  ): Promise<AuthResponseDto> {
    const result = await this.userManager.getUserById(userId);

    if (!isSuccessResult(result)) {
      return null;
    }

    const user = plainToInstance(AuthUserDto, result.data, {
      excludeExtraneousValues: true,
    });

    return this.getAuthResponseFromUser(user);
  }

  public async getAuthResponseFromUser(
    user: AuthUserDto
  ): Promise<AuthResponseDto> {
    await this.userManager.setLastLogin(user.id);
    await this.userManager.clearFailedLoginAttempts(user.id);
    const payload = JwtPayloadDto.fromUser(user).toObject();

    return new AuthResponseDto({
      user,
      tokens: {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(
          { sub: user.id },
          { expiresIn: this.configService.refreshExpiresIn }
        ),
      },
      requiresOtp: false,
    });
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
    updateAuthUserDto: UpdateAuthUserDto
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
      firstName,
      middleName,
      lastName,
      phoneNumber,
      birthDate,
    } = signUpDto;

    const newUser: Prisma.ApplicationUserCreateInput = {
      email,
      firstName,
      middleName: middleName || null,
      lastName,
      phoneNumber: phoneNumber || null,
      birthDate: birthDate || null,
      role: "USER",
    };

    if (password !== repeatedPassword) {
      throw new BadRequestException(
        "Password and repeated password don't correspond"
      );
    }

    const result = await this.userManager.createUser(newUser, password);

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }

    const emailToken = await this.userManager.generateEmailConfirmationToken(
      result.data.id
    );

    await this.emailService.sendEmail(
      result.data.email,
      "Completa la registrazione in EasyMotion",
      generateEmailConfirmMessage(
        this.frontendConfigService.url,
        emailToken,
        result.data.id,
        result.data.email
      )
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
    passwordChangeDto: PasswordChangeDto
  ): Promise<void> {
    const user = await this.getUserByIdOrThrow(userId);

    const { oldPassword, newPassword } = passwordChangeDto;

    const result = await this.userManager.changePassword(
      user.id,
      oldPassword,
      newPassword
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
      user.data.id
    );

    await this.emailService.sendEmail(
      user.data.email,
      "Modifica la tua password di EasyMotion",
      generatePasswordResetMessage(
        this.frontendConfigService.url,
        resetToken,
        user.data.id
      )
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
      newPassword
    );

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }
  }

  /**
   * Set the two-factor authentication status (enabled/disabled) for a user.
   * @param userId - The unique identifier of the user to update.
   * @param enabled - The new status to set for two-factor authentication.
   * @returns A promise that resolves with the new two-factor status.
   */
  async switchTwoFactorEnabled(userId: string, enabled: boolean) {
    const currentStatus = await this.userManager.setTwoFactorEnabled(
      userId,
      enabled
    );

    return { enabled: currentStatus };
  }

  async validateOtp(otpLoginDto: OtpLoginDto) {
    const { email, otp } = otpLoginDto;

    const result = await this.userManager.getUserByEmail(email);

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }

    const validationResult = await this.userManager.validateTwoFactor(
      result.data.id,
      otp
    );

    return validationResult ? result.data : null;
  }

  /**
   * Request to update the email address of a user.
   * @param userId The unique identifier of the user to update.
   * @param emailDto The data transfer object containing the new email address.
   */
  async requestEmailUpdate(userId: string, emailDto: EmailDto) {
    const user = await this.getUserByIdOrThrow(userId);
    const token = await this.userManager.generateEmailConfirmationToken(
      user.id
    );

    await this.emailService.sendEmail(
      emailDto.email,
      "Conferma la tua mail di EasyMotion",
      generateEmailConfirmMessage(
        this.frontendConfigService.url,
        token,
        user.id,
        emailDto.email
      )
    );
  }

  /**
   * Confirm the email address update for a user.
   * @param emailConfirmDto The data transfer object containing the user ID, token, and new email.
   */
  async confirmEmail(emailConfirmDto: EmailConfirmDto) {
    const user = await this.getUserByIdOrThrow(emailConfirmDto.userId);

    let result;
    if (user.email === emailConfirmDto.email && user.isEmailVerified) {
      result = await this.userManager.confirmEmail(
        user.id,
        emailConfirmDto.token
      );
    } else {
      result = await this.userManager.resetEmail(
        user.id,
        emailConfirmDto.token,
        emailConfirmDto.email
      );
    }

    if (!isSuccessResult(result)) {
      throw new BadRequestException({
        message: "Data provided is not valid for email confirmation",
      });
    }

    const authData = plainToInstance(AuthUserDto, user, {
      excludeExtraneousValues: true,
    });

    return this.getAuthResponseFromUser(authData);
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
