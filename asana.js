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

const PROJECT_ID = 1209708771942231;

const headers = {
  Authorization: `Bearer ${ASANA_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

// Create Task
async function createTask(name, notes = '', dueDate = null, assignee = null, projectId = null) {
  try {
    const taskData = {
      name,
      notes,
      projects: [projectId || PROJECT_ID],
    };

    if (dueDate) taskData.due_on = dueDate;
    if (assignee) taskData.assignee = assignee;

    console.log('Creating task with data:', JSON.stringify(taskData, null, 2));
    
    const response = await axios.post(
      `${ASANA_BASE_URL}/tasks`,
      { data: taskData },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
}

// List Tasks
async function listTasks() {
  try {
    console.log(`Listing tasks from project ${PROJECT_ID}`);
    
    const response = await axios.get(
      `${ASANA_BASE_URL}/projects/${PROJECT_ID}/tasks`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error listing tasks:', error.response?.data || error.message);
    throw error;
  }
}

// Update Task
async function updateTask(taskId, updatedFields) {
  const response = await axios.put(
    `${ASANA_BASE_URL}/tasks/${taskId}`,
    { data: updatedFields },
    { headers }
  );
  return response.data;
}

// Complete Task
async function completeTask(taskId) {
  const response = await axios.put(
    `${ASANA_BASE_URL}/tasks/${taskId}`,
    {
      data: { completed: true },
    },
    { headers }
  );
  return response.data;
}

// Delete Task
async function deleteTask(taskId) {
  const response = await axios.delete(
    `${ASANA_BASE_URL}/tasks/${taskId}`,
    { headers }
  );
  return { success: true, taskId };
}

// Export functions for use in MCP server (ES module style)
export {
  createTask,
  listTasks,
  updateTask,
  completeTask,
  deleteTask
};
