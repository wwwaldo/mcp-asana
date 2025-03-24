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
let WORKSPACE_ID = process.env.ASANA_WORKSPACE_ID;

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

// List all projects
async function listAllProjects() {
  try {
    // If no workspace ID is provided, list workspaces first
    if (!WORKSPACE_ID) {
      console.log('No workspace ID provided. Fetching workspaces first...');
      const workspacesResponse = await axios.get(`${ASANA_BASE_URL}/workspaces`, {
        headers: getHeaders(),
      });
      
      const workspaces = workspacesResponse.data.data;
      console.log('Available workspaces:');
      workspaces.forEach((workspace) => {
        console.log(`ID: ${workspace.gid}, Name: ${workspace.name}`);
      });
      
      if (workspaces.length > 0) {
        WORKSPACE_ID = workspaces[0].gid;
        console.log(`\nUsing workspace ID: ${WORKSPACE_ID} (${workspaces[0].name})`);
      } else {
        console.debug('No workspaces found. Please create a workspace in Asana first.');
        process.exit(1);
      }
    }

    console.log(`\nFetching projects from workspace ${WORKSPACE_ID}...`);
    const response = await axios.get(`${ASANA_BASE_URL}/projects`, {
      headers: getHeaders(),
      params: {
        workspace: WORKSPACE_ID,
      },
    });

    console.log('\nProjects:');
    response.data.data.forEach((project) => {
      console.log(`ID: ${project.gid}, Name: ${project.name}`);
    });

    return response.data;
  } catch (error) {
    console.debug('Error listing projects:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
listAllProjects().catch((error) => {
  console.debug('Failed to list projects:', error);
  process.exit(1);
});