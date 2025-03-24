// Asana API configuration
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const ASANA_BASE_URL = 'https://app.asana.com/api/1.0';

// Get configuration from environment variables
let ASANA_ACCESS_TOKEN = process.env.ASANA_ACCESS_TOKEN;
let PROJECT_ID = process.env.ASANA_PROJECT_ID;
let WORKSPACE_ID = process.env.ASANA_WORKSPACE_ID;

// Log configuration source
if (ASANA_ACCESS_TOKEN) {
  console.debug('Using Asana token from environment variables');
}

if (PROJECT_ID) {
  console.debug(`Using project ID from environment variables: ${PROJECT_ID}`);
}

if (WORKSPACE_ID) {
  console.debug(`Using workspace ID from environment variables: ${WORKSPACE_ID}`);
}

// Default values if not provided
if (!PROJECT_ID) {
  console.debug('No project ID specified. Some task operations may fail without a project ID.');
  PROJECT_ID = null;
}

if (!WORKSPACE_ID) {
  console.debug('No workspace ID specified. Some project operations may fail without a workspace ID.');
  WORKSPACE_ID = null;
}

// Validate token
if (!ASANA_ACCESS_TOKEN) {
  console.debug('Error: No Asana access token found. Please set ASANA_ACCESS_TOKEN in your .env file.');
  // Don't exit here, as this would prevent the server from starting with stub implementations
}

// Get headers for Asana API requests
function getHeaders() {
  return {
    Authorization: `Bearer ${ASANA_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

export {
  ASANA_BASE_URL,
  ASANA_ACCESS_TOKEN,
  PROJECT_ID,
  WORKSPACE_ID,
  getHeaders
};
