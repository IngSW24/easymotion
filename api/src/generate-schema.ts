import { writeFileSync } from 'fs';

const SWAGGER_URL = 'http://localhost:3000/swagger/json';
const OUTPUT_FILE = '/api-schema/schema.json';

async function fetchSwagger() {
  try {
    console.log(`Fetching Swagger JSON from ${SWAGGER_URL}...`);
    const response = await fetch(SWAGGER_URL);

    const data = await response.json();

    writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`Swagger schema saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Failed to fetch Swagger JSON:', error.message);
    process.exit(1);
  }
}

fetchSwagger();
