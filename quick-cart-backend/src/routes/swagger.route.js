import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Path to the openapi.yaml file
const yamlFilePath = path.resolve(__dirname, '../../../docs/api/openapi.yaml');

try {
  if (fs.existsSync(yamlFilePath)) {
    const swaggerDocument = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));

    // Serve the OpenAPI documentation
    router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } else {
    console.error('Error: openapi.yaml file not found at path:', yamlFilePath);
  }
} catch (err) {
  console.error('Error reading or parsing openapi.yaml file:', err);
}

export default router;
