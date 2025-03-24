#!/usr/bin/env node

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

const ASANA_BASE_URL = 'https://app.asana.com/api/1.0';

// Get Asana access token
let ASANA_ACCESS_TOKEN = process.env.ASANA_ACCESS_TOKEN;

if (!ASANA_ACCESS_TOKEN) {
  console.debug('Error: No Asana access token found.');
  console.debug('Please set your ASANA_ACCESS_TOKEN in your .env file.');
  process.exit(1);
}

// Get headers for Asana API requests
function getHeaders() {
  return {
    Authorization: `Bearer ${ASANA_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

async function listWorkspaces() {
  try {
    console.log('Fetching workspaces from Asana...');
    
    const response = await axios.get(`${ASANA_BASE_URL}/workspaces`, {
      headers: getHeaders(),
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
      console.debug('Error fetching workspaces:', err.response.status, err.response.statusText);
      console.debug('Error details:', JSON.stringify(err.response.data, null, 2));
    } else if (err.request) {
      console.debug('Error: No response received from Asana API');
    } else {
      console.debug('Error:', err.message);
    }
  }
}

// Execute the function
listWorkspaces();
