import { registerAs } from "@nestjs/config";

export default registerAs("ai", () => ({
  ollamaApiKey: process.env.OLLAMA_API_KEY,
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL,
  ollamaModel: process.env.OLLAMA_MODEL,
}));
