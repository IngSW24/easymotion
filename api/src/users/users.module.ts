import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'nestjs-prisma';
import { UserManager } from './user.manager';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService, PrismaService, UserManager],
  controllers: [UsersController],
  exports: [UserManager, UsersService],
})
export class UsersModule {}
