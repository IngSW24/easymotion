import { BadRequestException, Inject } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
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
import { AuthUserDto, BaseAuthUserDto } from "./dto/auth-user/auth-user.dto";
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
import IAssetsService, { ASSETS_SERVICE } from "src/assets/assets.interface";
import { DateTime } from "luxon";

@Injectable()
export class AuthService {
  constructor(
    private readonly userManager: UserManager,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(jwtConfig.KEY)
    private readonly configService: ConfigType<typeof jwtConfig>,
    @Inject(frontendConfig.KEY)
    private readonly frontendConfigService: ConfigType<typeof frontendConfig>,
    @Inject(ASSETS_SERVICE)
    private readonly assetsService: IAssetsService
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
    const user = await this.userManager.getUserByEmail(email, roles);

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

    return plainToInstance(BaseAuthUserDto, user, {
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

    const imagePath = await this.assetsService.uploadBuffer(
      buffer,
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

    const user = plainToInstance(BaseAuthUserDto, result, {
      excludeExtraneousValues: true,
    });

    return this.getAuthResponseFromUser(user);
  }

  public async getAuthResponseFromUser(
    user: BaseAuthUserDto
  ): Promise<AuthResponseDto> {
    await this.userManager.setLastLogin(user.id);
    await this.userManager.clearFailedLoginAttempts(user.id);
    const payload = JwtPayloadDto.fromUser(user);

    return {
      user,
      tokens: {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(
          { sub: user.id },
          { expiresIn: this.configService.refreshExpiresIn }
        ),
      },
      requiresOtp: false,
    };
  }

  /**
   * Fetches the user profile for the given user ID.
   * @param userId the ID of the user to fetch the profile for
   * @returns the user profile as an AuthUserDto
   */
  async getUserProfile(userId: string) {
    const result = await this.userManager.getUserById(userId);

    return plainToInstance(AuthUserDto, result, {
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

    const createdUser = await this.userManager.createUser(newUser, password);

    const emailToken = await this.userManager.generateEmailConfirmationToken(
      createdUser.id
    );

    await this.emailService.sendEmail(
      newUser.email,
      "Completa la registrazione in EasyMotion",
      generateEmailConfirmMessage(
        this.frontendConfigService.url,
        emailToken,
        createdUser.id,
        createdUser.email
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

    await this.userManager.changePassword(user.id, oldPassword, newPassword);
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

    const resetToken = await this.userManager.generatePasswordResetToken(
      user.id
    );

    await this.emailService.sendEmail(
      user.email,
      "Modifica la tua password di EasyMotion",
      generatePasswordResetMessage(
        this.frontendConfigService.url,
        resetToken,
        user.id
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

    await this.userManager.resetPassword(user.id, token, newPassword);
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

    const validationResult = await this.userManager.validateTwoFactor(
      result.id,
      otp
    );

    return validationResult ? plainToInstance(BaseAuthUserDto, result) : null;
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

    try {
      if (user.email === emailConfirmDto.email && user.isEmailVerified) {
        await this.userManager.confirmEmail(user.id, emailConfirmDto.token);
      } else {
        await this.userManager.resetEmail(
          user.id,
          emailConfirmDto.token,
          emailConfirmDto.email
        );
      }
    } catch (_) {
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
    return this.userManager.getUserById(userId);
  }
}
