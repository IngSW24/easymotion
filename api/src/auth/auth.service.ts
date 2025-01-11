import { BadRequestException } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  isSuccessResult,
  resultToHttpException,
} from 'src/common/types/result';
import { UserManager } from 'src/users/user.manager';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userManager: UserManager,
    private jwtService: JwtService,
  ) {}

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
  }

  /**
   * Authenticates a user by their email and password.
   * @param signInDto - The data transfer object containing the user's login details.
   * @returns A promise that resolves with an object containing the access token
   *          if authentication is successful.
   * @throws NotFoundException if the user is not found.
   * @throws UnauthorizedException if the password is invalid.
   * @throws BadRequestException if user's mail is not verified.
   */
  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const result = await this.userManager.getUserByEmail(signInDto.email);

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }

    const user = result.data;

    const isValidPwd = await this.userManager.verifyPassword(
      user.passwordHash,
      signInDto.password,
    );

    if (!isValidPwd) {
      await this.userManager.increaseFailedLoginAttempts(user.id);
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException('Email unverified');
    }

    await this.userManager.clearFailedLoginAttempts(user.id);
    await this.userManager.setLastLogin(user.id);

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
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userManager.getUserById(userId);

    if (!isSuccessResult(user)) {
      throw resultToHttpException(user);
    }

    const result = await this.userManager.changePassword(
      userId,
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
  async requestResetPassword(email: string): Promise<void> {
    const user = await this.userManager.getUserByEmail(email);

    if (!isSuccessResult(user)) {
      throw resultToHttpException(user);
    }

    const resetToken = await this.userManager.generatePasswordResetToken(
      user.data.id,
    );

    // TODO: Send email with reset token
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
  async resetPassword(
    email: string,
    resetRequestToken: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userManager.getUserByEmail(email);

    if (!isSuccessResult(user)) {
      throw resultToHttpException(user);
    }

    const result = await this.userManager.resetPassword(
      email,
      resetRequestToken,
      newPassword,
    );

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }
  }
}
