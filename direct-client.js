#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage:');
  console.log('  node direct-client.js create-task "Task Name" "Description" "Due Date" "Assignee" "Project"');
  console.log('  node direct-client.js update-task "TaskId" "New Name" "New Description" "New Due Date" "New Assignee" "true|false"');
  console.log('  node direct-client.js delete-task "TaskId"');
  process.exit(1);
}

const command = args[0];

// Create the appropriate JSON message based on the command
let message;
const id = Date.now().toString();

switch (command) {
  case 'create-task':
    message = {
      type: 'invoke',
      id,
      method: 'create-task',
      params: {
        name: args[1] || 'New Task',
        description: args[2],
        dueDate: args[3],
        assignee: args[4],
        project: args[5]
      }
    };
    break;
  case 'update-task':
    message = {
      type: 'invoke',
      id,
      method: 'update-task',
      params: {
        taskId: args[1],
        name: args[2],
        description: args[3],
        dueDate: args[4],
        assignee: args[5],
        completed: args[6] === 'true'
      }
    };
    break;
  case 'delete-task':
    message = {
      type: 'invoke',
      id,
      method: 'delete-task',
      params: {
        taskId: args[1]
      }
    };
    break;
  default:
    console.debug(`Unknown command: ${command}`);
    process.exit(1);
}

// Start the server process
const serverPath = path.join(__dirname, 'dist', 'server.js');
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Create readline interface to read line by line
const rl = readline.createInterface({
  input: server.stdout,
  terminal: false
});

// Handle server output line by line
rl.on('line', (line) => {
  try {
    // Try to parse as JSON
    const data = JSON.parse(line);
    if (data.type === 'result' && data.id === id) {
      console.log('Received result:');
      console.log(JSON.stringify(data, null, 2));
      // Success, we can exit
      server.kill();
      process.exit(0);
    } else if (data.type === 'error' && data.id === id) {
      console.debug('Received error:');
      console.debug(JSON.stringify(data, null, 2));
      server.kill();
      process.exit(1);
    } else {
      console.log('Received other message:', line);
    }
  } catch (e) {
    // Not JSON, just log the line
    console.log('Server output:', line);
  }
});

server.stderr.on('data', (data) => {
  console.debug('Server error:', data.toString());
});

// Wait for server to initialize
setTimeout(() => {
  // Send the message to the server
  console.log('Sending message to server:', JSON.stringify(message, null, 2));
  server.stdin.write(JSON.stringify(message) + '\n');
}, 1000);

// Set a timeout to kill the server process after 10 seconds
setTimeout(() => {
  console.log('Timeout reached, killing server process');
  server.kill();
  process.exit(1);
}, 10000);

// Handle server exit
server.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
});
