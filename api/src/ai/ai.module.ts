import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { HttpModule } from "@nestjs/axios";
import { AiService } from './ai.service';

@Module({
  imports: [HttpModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
