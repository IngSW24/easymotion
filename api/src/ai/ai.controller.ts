import { Body, Controller, Post, Res } from "@nestjs/common";
import { TextDto } from "./dto/text.dto";
import { Response } from "express";
import { AiService } from "./ai.service";
import { ApiOkResponse } from "@nestjs/swagger";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("summarize")
  @ApiOkResponse({ type: TextDto })
  @UseAuth()
  async getSummarization(@Body() body: TextDto, @Res() res: Response) {
    this.aiService
      .ollamaGenerate(
        `
        RIASSUMI il testo seguente in UNA frase con MASSIMO 20 PAROLE. Rispondi SOLO con il testo riassunto e NON aggiungere altro alla risposta.
          
        <text_to_summarize>${body.text}</text_to_summarize>
        `
      )
      .subscribe({
        next: (response) =>
          res.status(200).json({ text: response.data.response }),
        error: (_err) => res.status(500).send("Upstream error"),
      });
  }
}
