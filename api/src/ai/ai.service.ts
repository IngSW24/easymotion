import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import aiConfig from "src/config/ai.config";

@Injectable()
export class AiService {
  constructor(
    @Inject(aiConfig.KEY) private readonly config: ConfigType<typeof aiConfig>,
    private readonly httpService: HttpService
  ) {}

  ollamaGenerate(prompt: string) {
    return this.httpService.post(
      `${this.config.ollamaBaseUrl}/api/generate`,
      {
        model: this.config.ollamaModel,
        stream: false,
        prompt,
      },
      {
        headers: { "x-api-key": this.config.ollamaApiKey },
      }
    );
  }
}
