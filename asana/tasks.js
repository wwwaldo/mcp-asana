// Asana Tasks API integration
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getHeaders, ASANA_BASE_URL, PROJECT_ID } from './config.js';

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
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
}

// List Tasks
async function listTasks(projectId = null) {
  try {
    const targetProjectId = projectId || PROJECT_ID;
    console.log(`Listing tasks from project ${targetProjectId}`);
    
    const response = await axios.get(
      `${ASANA_BASE_URL}/projects/${targetProjectId}/tasks`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error listing tasks:', error.response?.data || error.message);
    throw error;
  }
}

// Update Task
async function updateTask(taskId, updatedFields) {
  try {
    console.log(`Updating task ${taskId} with data:`, JSON.stringify(updatedFields, null, 2));
    
    const response = await axios.put(
      `${ASANA_BASE_URL}/tasks/${taskId}`,
      { data: updatedFields },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error.response?.data || error.message);
    throw error;
  }
}

// Complete Task
async function completeTask(taskId) {
  try {
    console.log(`Completing task ${taskId}`);
    
    const response = await axios.put(
      `${ASANA_BASE_URL}/tasks/${taskId}`,
      {
        data: { completed: true },
      },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error completing task:', error.response?.data || error.message);
    throw error;
  }
}

// Delete Task
async function deleteTask(taskId) {
  try {
    console.log(`Deleting task ${taskId}`);
    
    const response = await axios.delete(
      `${ASANA_BASE_URL}/tasks/${taskId}`,
      { headers: getHeaders() }
    );
    return { success: true, taskId };
  } catch (error) {
    console.error('Error deleting task:', error.response?.data || error.message);
    throw error;
  }
}

// Export functions
export {
  createTask,
  listTasks,
  updateTask,
  completeTask,
  deleteTask
};
