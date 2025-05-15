import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { ApplicationUser, Prisma, Role } from "@prisma/client";
import * as argon2 from "argon2";
import { DateTime } from "luxon";
import { randomBytes, randomInt } from "node:crypto";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "nestjs-prisma";
import { UpdateUserDto } from "./dto/user/update-user.dto";
import { AuthUserDto } from "src/auth/dto/auth-user/auth-user.dto";

@Injectable()
export class UserManager {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new user with the provided data and password.
   * @param newUser - User data (email, etc.) for creation.
   * @param password - The plain text password to be hashed and stored.
   * @returns A promise that resolves with a success Result containing the created user,
   *          or an error Result if a user with the given email already exists.
   */
  async createUser(
    newUser: Prisma.ApplicationUserCreateInput,
    password: string
  ) {
    const existingUser = await this.prisma.applicationUser.findFirst({
      where: { email: newUser.email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await this.hashPassword(password);

    const createdUser = await this.prisma.$transaction(async (tx) => {
      const createdUser = await this.prisma.applicationUser.create({
        data: {
          ...newUser,
          passwordHash: hashedPassword,
        },
        include: { patient: true, physiotherapist: true },
      });

      switch (createdUser.role) {
        case Role.PHYSIOTHERAPIST:
          await tx.physiotherapist.create({
            data: {
              applicationUser: {
                connect: { id: createdUser.id },
              },
            },
          });
          break;
        case Role.USER:
          await tx.patient.create({
            data: {
              applicationUser: { connect: { id: createdUser.id } },
            },
          });
          break;
        default:
          break;
      }

      return createdUser;
    });

    return createdUser;
  }

  /**
   * Retrieves a user by their unique ID.
   * @param userId - The ID of the user to retrieve.
   * @returns A promise that resolves with a success Result if the user is found,
   *          or an error Result if not found.
   */
  async getUserById(
    userId: string,
    roles: Role[] = undefined
  ): Promise<AuthUserDto> {
    return this.prisma.applicationUser.findUniqueOrThrow({
      where: { id: userId, ...(roles && { role: { in: roles } }) },
      include: { physiotherapist: true, patient: true },
    });
  }

  /**
   * Retrieves a user by their email address.
   * @param email - The email address of the user to retrieve.
   * @returns A promise that resolves with a success Result if the user is found,
   *          or an error Result if not found.
   */
  async getUserByEmail(email: string, roles: Role[] = undefined) {
    return this.prisma.applicationUser.findUniqueOrThrow({
      where: { email, ...(roles && { role: { in: roles } }) },
      include: { physiotherapist: true, patient: true },
    });
  }

  /**
   * Determines if a user is allowed to log in based on their failed login attempts
   * and email verification status.
   * @param user - The user to check for login eligibility.
   * @returns A boolean indicating if the user can log in.
   */
  canUserLogin(user: ApplicationUser): boolean {
    return user.failedLoginAttempts < 5 && user.isEmailVerified;
  }

  /**
   * Updates a user's information by user ID.
   * @param userId - The ID of the user to update.
   * @param data - The fields to update on the user.
   * @returns A promise that resolves with a success Result containing the updated user.
   */
  async updateUser(userId: string, data: UpdateUserDto) {
    const user = await this.getUserById(userId); // ensures user exists

    if (this.isUpdateDataValid(user, data)) {
      throw new BadRequestException("Attempting to update wrong user type");
    }

    const updateData: Prisma.ApplicationUserUpdateInput = {
      ...data,
      physiotherapist: {
        update: data.physiotherapist,
      },
      patient: {
        update: data.patient,
      },
    };

    return this.prisma.applicationUser.update({
      where: { id: user.id },
      include: { patient: true, physiotherapist: true },
      data: updateData,
    });
  }

  /**
   * Checks if the update data is valid for the user.
   * @param user - The user to check the update data for.
   * @param data - The update data to check.
   * @returns A boolean indicating if the update data is valid for the user.
   */
  private isUpdateDataValid(user: ApplicationUser, data: UpdateUserDto) {
    return (
      (user.role !== Role.PHYSIOTHERAPIST && !!data.physiotherapist) ||
      (user.role !== Role.USER && !!data.patient)
    );
  }

  /**
   * Deletes a user by their ID.
   * @param userId - The ID of the user to delete.
   * @returns A promise that resolves with a success Result if deletion is successful,
   *          or an error Result if there's a server error or user not found.
   */
  async deleteUser(userId: string) {
    await this.prisma.applicationUser.delete({
      where: { id: userId },
    });
  }

  /**
   * Generates a password reset token, stores it with a 1-hour expiry, and returns the token.
   * @param userId - The ID of the user requesting a password reset.
   * @returns A promise that resolves to the reset token string.
   */
  async generatePasswordResetToken(userId: string): Promise<string> {
    const resetToken = randomBytes(32).toString("hex");
    const expiryDate = DateTime.now().plus({ hours: 1 });

    const updatedUser = await this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpiry: expiryDate.toJSDate(),
      },
    });

    return updatedUser.passwordResetToken;
  }

  /**
   * Sets a new password for the specified user, removing any reset tokens.
   * @param userId - The ID of the user whose password is to be set.
   * @param password - The new plain text password to be hashed.
   */
  async setNewPassword(userId: string, password: string) {
    const hashedPassword = await this.hashPassword(password);
    return this.prisma.applicationUser.update({
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
    newPassword: string
  ) {
    const userResult = await this.getUserById(userId);
    const isPasswordValid = await this.verifyPassword(
      userResult.passwordHash,
      oldPassword
    );

    if (!isPasswordValid) {
      throw new BadRequestException("Invalid password");
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
  }

  /**
   * Resets a user's password if the provided token is valid and not expired.
   * @param userId - The ID of the user to reset the password for.
   * @param resetToken - The token that was previously generated for password reset.
   * @param newPassword - The new password to be hashed and set.
   * @returns A promise that resolves with a success Result on success or an error Result on failure.
   */
  async resetPassword(userId: string, resetToken: string, newPassword: string) {
    const user = await this.prisma.applicationUser.findUniqueOrThrow({
      where: {
        id: userId,
        passwordResetTokenExpiry: {
          gte: DateTime.now().toJSDate(), // check if token is not expired
        },
      },
    });

    if (user.passwordResetToken !== resetToken) {
      throw new BadRequestException("Invalid reset token");
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

    const updatedUser = await this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        emailConfirmationToken: confirmationToken,
        emailConfirmationTokenExpiry: expiryDate,
      },
    });

    return updatedUser.emailConfirmationToken;
  }

  /**
   * Changes a user's email if the provided token is valid and not expired.
   * @param userId - The ID of the user.
   * @param resetToken - The email confirmation token.
   * @param newEmail - The new email address to set.
   * @returns A promise that resolves to the updated ApplicationUser.
   */
  async resetEmail(userId: string, resetToken: string, newEmail: string) {
    const user = await this.prisma.applicationUser.findUniqueOrThrow({
      where: {
        id: userId,
        emailConfirmationToken: resetToken,
        emailConfirmationTokenExpiry: { gte: DateTime.now().toJSDate() },
      },
    });

    await this.prisma.applicationUser.update({
      where: { id: user.id },
      data: {
        email: newEmail,
        isEmailVerified: true,
        emailConfirmationToken: null,
        emailConfirmationTokenExpiry: null,
      },
    });
  }

  /**
   * Confirms a user's email address if the provided token is valid and not expired.
   * @param userId The ID of the user.
   * @param token The email confirmation token.
   * @returns A promise that resolves with a success Result on success or an error Result on failure.
   */
  async confirmEmail(userId: string, token: string) {
    const result = await this.prisma.applicationUser.update({
      where: {
        id: userId,
        emailConfirmationToken: token,
        emailConfirmationTokenExpiry: { gte: DateTime.now().toJSDate() },
      },
      data: {
        emailConfirmationToken: null,
        emailConfirmationTokenExpiry: null,
        isEmailVerified: true,
      },
    });

    if (!result) {
      throw new BadRequestException("Invalid or expired confirmation token");
    }
  }

  /**
   * Sets a user's email directly (e.g., by an admin or a verified process).
   * @param userId - The ID of the user whose email is being set.
   * @param email - The new email address to set.
   * @returns A promise that resolves to the updated ApplicationUser.
   */
  async setNewEmail(userId: string, email: string) {
    return this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        email,
        isEmailVerified: true,
        emailConfirmationToken: null,
        emailConfirmationTokenExpiry: null,
      },
    });
  }

  /**
   * Enables or disables two-factor authentication for a user.
   * @param userId - The ID of the user.
   * @param enabled - Whether to enable or disable 2FA.
   * @returns A promise that resolves to the updated ApplicationUser.
   */
  async setTwoFactorEnabled(userId: string, enabled: boolean) {
    const updatedUser = await this.prisma.applicationUser.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: enabled,
      },
    });

    return updatedUser.twoFactorEnabled;
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

    const updatedUser = await this.prisma.applicationUser.update({
      where: { id: userId, twoFactorEnabled: true },
      data: {
        twoFactorCode: otp,
        twoFactorExpiry: expiry,
      },
    });

    return updatedUser.twoFactorCode;
  }

  /**
   * Validates an OTP code for the given user.
   * @param userId - The user's ID.
   * @param code - The OTP code to check.
   * @returns A boolean indicating if the OTP was valid and not expired.
   */
  async validateTwoFactor(userId: string, code: string): Promise<boolean> {
    const user = await this.getUserById(userId);

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
    time: DateTime | undefined = DateTime.now()
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
    plainPassword: string
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
    return randomInt(100000, 1000000).toString();
  }
}
