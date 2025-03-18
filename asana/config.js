// Asana API configuration
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASANA_BASE_URL = 'https://app.asana.com/api/1.0';

// Try to read token from file if not in environment variable
let ASANA_ACCESS_TOKEN = process.env.ASANA_ACCESS_TOKEN;

if (!ASANA_ACCESS_TOKEN) {
  try {
    const tokenPath = path.join(__dirname, '..', 'asana.token');
    if (fs.existsSync(tokenPath)) {
      ASANA_ACCESS_TOKEN = fs.readFileSync(tokenPath, 'utf8').trim();
      console.log('Using token from asana.token file');
    }
  } catch (err) {
    console.error('Error reading token file:', err.message);
  }
}

// Default project ID (Claudeject)
const PROJECT_ID = 1209708771942231;

// Default workspace ID
const WORKSPACE_ID = 1201956770127069;

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
