import { registerAs } from "@nestjs/config";

export default registerAs("pdf", () => ({
  pdf_api_key: process.env.PDF_API_KEY,
}));
