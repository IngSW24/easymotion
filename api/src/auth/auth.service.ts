import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserManager } from 'src/users/user.manager';

@Injectable()
export class AuthService {
  constructor(
    private userManager: UserManager,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user by their email and password.
   * @param email - The email address of the user attempting to sign in.
   * @param pass - The password provided by the user.
   * @returns A promise that resolves with an object containing the access token
   *          if authentication is successful.
   * @throws NotFoundException if the user is not found.
   * @throws UnauthorizedException if the password is invalid.
   */
  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const result = await this.userManager.getUserByEmail(email);

    if (result.success === false) {
      throw new NotFoundException(result.errors.join(', '));
    }

    const user = result.data;

    const isValidPwd = await this.userManager.verifyPassword(
      user.passwordHash,
      pass,
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
}
