import { registerAs } from "@nestjs/config";

export default registerAs("pdf", () => ({
  pdfApiKey: process.env.PDF_API_KEY,
}));
