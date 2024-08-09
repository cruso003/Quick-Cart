// src/routes/swagger.js
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const router = express.Router();

// Path to the openapi.yaml file
const swaggerDocument = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../../docs/api/openapi.yaml'), 'utf8'));

// Serve the OpenAPI documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
