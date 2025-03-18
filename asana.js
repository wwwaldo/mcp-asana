const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
async function createTask(name, notes = '', dueDate = null, assignee = null) {
  const taskData = {
    name,
    notes,
    projects: [PROJECT_ID],
  };

  if (dueDate) taskData.due_on = dueDate;
  if (assignee) taskData.assignee = assignee;

  const response = await axios.post(
    `${ASANA_BASE_URL}/tasks`,
    { data: taskData },
    { headers }
  );
  return response.data;
}

// List Tasks
async function listTasks() {
  const response = await axios.get(
    `${ASANA_BASE_URL}/projects/${PROJECT_ID}/tasks`,
    { headers }
  );
  return response.data;
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

// Export functions for use in MCP server
module.exports = {
  createTask,
  listTasks,
  updateTask,
  completeTask,
  deleteTask,
  
  // Handlers for External Service
  createTaskHandler: async (req, res) => {
    const { name, notes, dueDate, assignee } = req.body;
    try {
      const task = await createTask(name, notes, dueDate, assignee);
      res.json(task);
    } catch (err) {
      res.status(err.response?.status || 500).json(err.response?.data || err);
    }
  },

  listTasksHandler: async (req, res) => {
    try {
      const tasks = await listTasks();
      res.json(tasks);
    } catch (err) {
      res.status(err.response?.status || 500).json(err.response?.data || err);
    }
  },

  updateTaskHandler: async (req, res) => {
    const { taskId } = req.params;
    const updatedFields = req.body;
    try {
      const task = await updateTask(taskId, updatedFields);
      res.json(task);
    } catch (err) {
      res.status(err.response?.status || 500).json(err.response?.data || err);
    }
  },

  completeTaskHandler: async (req, res) => {
    const { taskId } = req.params;
    try {
      const task = await completeTask(taskId);
      res.json(task);
    } catch (err) {
      res.status(err.response?.status || 500).json(err.response?.data || err);
    }
  },
};
