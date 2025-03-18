#!/usr/bin/env node

import axios from 'axios';
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
    const tokenPath = path.join(__dirname, 'asana.token');
    if (fs.existsSync(tokenPath)) {
      ASANA_ACCESS_TOKEN = fs.readFileSync(tokenPath, 'utf8').trim();
      console.log('Using token from asana.token file');
    }
  } catch (err) {
    console.error('Error reading token file:', err.message);
  }
}

if (!ASANA_ACCESS_TOKEN) {
  console.error('Please set your ASANA_ACCESS_TOKEN environment variable or create an asana.token file.');
  process.exit(1);
}

async function listWorkspaces() {
  try {
    console.log('Fetching workspaces from Asana...');
    
    const response = await axios.get(`${ASANA_BASE_URL}/workspaces`, {
      headers: {
        Authorization: `Bearer ${ASANA_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const workspaces = response.data.data;
    
    if (workspaces.length === 0) {
      console.log('No workspaces found.');
      return;
    }
    
    console.log('\nWorkspaces:');
    console.log('===========');
    workspaces.forEach((workspace) => {
      console.log(`Workspace: ${workspace.name} | ID: ${workspace.gid}`);
    });
    console.log('\nTotal workspaces:', workspaces.length);
  } catch (err) {
    if (err.response) {
      console.error('Error fetching workspaces:', err.response.status, err.response.statusText);
      console.error('Error details:', JSON.stringify(err.response.data, null, 2));
    } else if (err.request) {
      console.error('Error: No response received from Asana API');
    } else {
      console.error('Error:', err.message);
    }
  }
}

// Execute the function
listWorkspaces();
