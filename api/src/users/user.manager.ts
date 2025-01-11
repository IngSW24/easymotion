import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationUser, Prisma } from '@prisma/client';
import { ResultPromise, isSuccessResult } from 'src/common/types/result';
import * as argon2 from 'argon2';
import { DateTime } from 'luxon';
import { randomBytes } from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserManager {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new user with the provided data and password.
   * @param newUser - User data (email, username, etc.) for creation.
   * @param password - The plain text password to be hashed and stored.
   * @returns A promise that resolves with a success Result containing the created user,
   *          or an error Result if a user with the given email or username already exists.
   */
  async createUser(
    newUser: Prisma.ApplicationUserCreateInput,
    password: string,
  ): ResultPromise<ApplicationUser> {
    const existingUser = await this.prisma.applicationUser.findFirst({
      where: {
        OR: [{ email: newUser.email }, { username: newUser.username }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        errors: ['User with this email or username already exists'],
        code: HttpStatus.CONFLICT,
      };
    }

    const hashedPassword = await this.hashPassword(password);

    const createdUser = await this.prisma.applicationUser.create({
      data: {
        ...newUser,
        passwordHash: hashedPassword,
      },
    });

    return { success: true, data: createdUser };
  }

  /**
   * Retrieves all users from the database.
   * @returns A promise that resolves with a success Result containing an array of ApplicationUser.
   */
  async getUsers(): ResultPromise<ApplicationUser[]> {
    const data = await this.prisma.applicationUser.findMany();
    return { success: true, data };
  }

  /**
   * Retrieves a user by their unique ID.
   * @param userId - The ID of the user to retrieve.
   * @returns A promise that resolves with a success Result if the user is found,
   *          or an error Result if not found.
   */
  async getUserById(userId: string): ResultPromise<ApplicationUser> {
    const user = await this.prisma.applicationUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        errors: ['User not found'],
        code: HttpStatus.NOT_FOUND,
      };
    }

    return { success: true, data: user };
  }

  /**
   * Retrieves a user by their email address.
   * @param email - The email address of the user to retrieve.
   * @returns A promise that resolves with a success Result if the user is found,
   *          or an error Result if not found.
   */
  async getUserByEmail(email: string): ResultPromise<ApplicationUser> {
    const user = await this.prisma.applicationUser.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        errors: ['User not found'],
        code: HttpStatus.NOT_FOUND,
      };
    }

    return { success: true, data: user };
  }

  /**
   * Updates a user's information by user ID.
   * @param userId - The ID of the user to update.
   * @param data - The fields to update on the user.
   * @returns A promise that resolves with a success Result containing the updated user.
   */
  async updateUser(
    userId: string,
    data: Prisma.ApplicationUserUpdateInput,
  ): ResultPromise<ApplicationUser> {
    const user = await this.getUserById(userId); // ensures user exists
    if (!isSuccessResult(user)) return user;

    const updatedUser = await this.prisma.applicationUser.update({
      where: { id: userId },
      data,
    });

    return { success: true, data: updatedUser };
  }

  /**
   * Deletes a user by their ID.
   * @param userId - The ID of the user to delete.
   * @returns A promise that resolves with a success Result if deletion is successful,
   *          or an error Result if there's a server error or user not found.
   */
  async deleteUser(userId: string): ResultPromise<void> {
    await this.prisma.applicationUser.delete({
      where: { id: userId },
    });

    return { success: true, data: null };
  }

  /**
   * Generates a password reset token, stores it with a 1-hour expiry, and returns the token.
   * @param userId - The ID of the user requesting a password reset.
   * @returns A promise that resolves to the reset token string.
   */
  async generatePasswordResetToken(userId: string): Promise<string> {
    const resetToken = randomBytes(32).toString('hex');
    const expiryDate = DateTime.now().plus({ hours: 1 });

    await this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpiry: expiryDate.toJSDate(),
      },
    });

    return resetToken;
  }

  /**
   * Sets a new password for the specified user, removing any reset tokens.
   * @param userId - The ID of the user whose password is to be set.
   * @param password - The new plain text password to be hashed.
   */
  async setPassword(userId: string, password: string) {
    const hashedPassword = await this.hashPassword(password);
    this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });
  }

  /**
   * Changes a user's password by verifying the old one before hashing and setting the new one.
   * @param userId - The ID of the user to update.
   * @param oldPassword - The user's current password for verification.
   * @param newPassword - The new password to be hashed and saved.
   * @returns A promise that resolves with a success Result or an error Result if old password is invalid.
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): ResultPromise<void> {
    const userResult = await this.getUserById(userId);

    if (!isSuccessResult(userResult)) return userResult;

    const isPasswordValid = await this.verifyPassword(
      userResult.data.passwordHash,
      oldPassword,
    );

    if (!isPasswordValid) {
      return {
        success: false,
        errors: ['Invalid password'],
        code: HttpStatus.BAD_REQUEST,
      };
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });

    return { success: true, data: null };
  }

  /**
   * Resets a user's password if the provided token is valid and not expired.
   * @param userId - The ID of the user to reset the password for.
   * @param resetToken - The token that was previously generated for password reset.
   * @param newPassword - The new password to be hashed and set.
   * @returns A promise that resolves with a success Result on success or an error Result on failure.
   */
  async resetPassword(
    userId: string,
    resetToken: string,
    newPassword: string,
  ): ResultPromise<void> {
    const user = await this.prisma.applicationUser.findUnique({
      where: {
        id: userId,
        passwordResetTokenExpiry: {
          gte: DateTime.now().toJSDate(), // check if token is not expired
        },
      },
    });

    if (!user) {
      return {
        success: false,
        errors: ['Invalid or expired reset token'],
        code: HttpStatus.BAD_REQUEST,
      };
    }

    if (user.passwordResetToken !== resetToken) {
      return {
        success: false,
        errors: ['Invalid reset token'],
        code: HttpStatus.BAD_REQUEST,
      };
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.prisma.applicationUser.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });
  }

  /**
   * Generates an email confirmation token, stores it, and returns the token.
   * @param userId - The ID of the user requiring email confirmation.
   * @returns A promise that resolves to the generated confirmation token.
   */
  async generateEmailConfirmationToken(userId: string): Promise<string> {
    const confirmationToken = uuidv4();
    const expiryDate = DateTime.now().plus({ days: 1 }).toJSDate();

    await this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        emailConfirmationToken: confirmationToken,
        emailConfirmationTokenExpiry: expiryDate,
      },
    });

    return confirmationToken;
  }

  /**
   * Changes a user's email if the provided token is valid and not expired.
   * @param userId - The ID of the user.
   * @param token - The email confirmation token.
   * @param newEmail - The new email address to set.
   * @returns A promise that resolves to the updated ApplicationUser.
   */
  async changeEmail(
    userId: string,
    token: string,
    newEmail: string,
  ): ResultPromise<void> {
    const result = await this.prisma.applicationUser.findUnique({
      where: {
        id: userId,
        emailConfirmationToken: token,
        emailConfirmationTokenExpiry: { gte: DateTime.now().toJSDate() },
      },
    });

    if (!result) {
      return {
        success: false,
        errors: ['Invalid or expired confirmation token'],
        code: HttpStatus.BAD_REQUEST,
      };
    }

    await this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        email: newEmail,
        isEmailVerified: true,
      },
    });

    return { success: true, data: null };
  }

  /**
   * Sets a user's email directly (e.g., by an admin or a verified process).
   * @param userId - The ID of the user whose email is being set.
   * @param email - The new email address to set.
   * @returns A promise that resolves to the updated ApplicationUser.
   */
  async setEmail(userId: string, email: string) {
    return this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        email,
        isEmailVerified: true,
      },
    });
  }

  /**
   * Enables or disables two-factor authentication for a user.
   * @param userId - The ID of the user.
   * @param enabled - Whether to enable or disable 2FA.
   * @returns A promise that resolves to the updated ApplicationUser.
   */
  async setTwoFactor(userId: string, enabled: boolean) {
    return this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: enabled,
      },
    });
  }

  /**
   * Generates an OTP code for 2FA if enabled, stores it with a 5-minute expiry, and returns the code.
   * @param userId - The ID of the user needing an OTP.
   * @returns A promise that resolves to the generated OTP string.
   */
  async generateOtpCode(userId: string): Promise<string> {
    const otp = this.generateRandomSixDigitCode();
    const expiry = DateTime.fromJSDate(new Date())
      .plus({ minutes: 5 })
      .toJSDate();

    await this.prisma.applicationUser.update({
      where: { id: userId, twoFactorEnabled: true },
      data: {
        twoFactorCode: otp,
        twoFactorExpiry: expiry,
      },
    });

    return otp;
  }

  /**
   * Validates an OTP code for the given user.
   * @param userId - The user's ID.
   * @param code - The OTP code to check.
   * @returns A boolean indicating if the OTP was valid and not expired.
   */
  async validateOtpCode(userId: string, code: string): Promise<boolean> {
    const userResult = await this.getUserById(userId);

    if (!isSuccessResult(userResult)) return false;

    const { data: user } = userResult;

    if (user.twoFactorCode !== code) return false;

    if (
      !user.twoFactorExpiry ||
      DateTime.fromJSDate(user.twoFactorExpiry) < DateTime.now()
    ) {
      return false;
    }

    await this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        twoFactorCode: null,
        twoFactorExpiry: null,
      },
    });

    return true;
  }

  /**
   * Sets the user's last login time (defaults to the current time).
   * @param userId - The user's ID.
   * @param time - The DateTime to set as last login (defaults to now).
   * @returns A promise that resolves to the updated ApplicationUser.
   */
  async setLastLogin(
    userId: string,
    time: DateTime | undefined = DateTime.now(),
  ) {
    return this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        lastLogin: time.toJSDate(),
      },
    });
  }

  /**
   * Increments the user's failed login attempt counter.
   * @param userId - The user's ID.
   * @returns A promise that resolves to the new count of failed login attempts.
   */
  async increaseFailedLoginAttempts(userId: string) {
    const updatedUser = await this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: {
          increment: 1,
        },
      },
    });

    return updatedUser.failedLoginAttempts;
  }

  /**
   * Clears the user's failed login attempt counter (sets it to 0).
   * @param userId - The user's ID.
   * @returns A promise that resolves to the updated ApplicationUser.
   */
  async clearFailedLoginAttempts(userId: string) {
    return this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
      },
    });
  }

  /**
   * Verifies a plain password against a hashed password using Argon2.
   * @param hashedPassword - The stored hashed password.
   * @param plainPassword - The plain text password to verify.
   * @returns A boolean indicating if the passwords match.
   */
  async verifyPassword(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, plainPassword);
  }

  /**
   * Hashes a password using Argon2.
   * @param password - The plain text password to hash.
   * @returns A promise that resolves to the hashed password string.
   */
  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  /**
   * Utility method to generate a random 6-digit code, e.g., "123456".
   * @returns A 6-digit random code in string format.
   */
  private generateRandomSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
