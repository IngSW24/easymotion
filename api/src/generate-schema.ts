import { writeFileSync } from "fs";
import { bootstrap, setupSwagger } from "./bootstrap";

async function generateSchema() {
  const destination = process.argv[2] || "../openapi/schema.json";
  const app = await bootstrap();
  const document = setupSwagger(app);
  console.log("Writing schema...");
  writeFileSync(destination, JSON.stringify(document, null, 2));
  console.log("Done!");
  process.exit(0);
}

generateSchema();
