import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [ConfigModule.forRoot(), EventsModule, PrismaModule],
})
export class AppModule {}
