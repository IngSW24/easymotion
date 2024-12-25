import { writeFileSync } from 'fs';
import { bootstrap, setupSwagger } from './bootstrap';

async function generateSchema() {
  const app = await bootstrap();
  const document = setupSwagger(app);
  console.log('Writing schema to /api-schema/schema.json');
  writeFileSync('/api-schema/schema.json', JSON.stringify(document, null, 2));
  console.log('Done!');
  process.exit(0);
}

generateSchema();
