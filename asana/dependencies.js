/**
 * Asana Task Dependencies API integration
 * 
 * WARNING: All task dependency features require a PREMIUM ASANA ACCOUNT.
 * These functions will return 402 Payment Required errors if used with a free account.
 */
import axios from 'axios';
import { getHeaders, ASANA_BASE_URL } from './config.js';

/**
 * Add dependencies to a task
 * @param {string} taskId - The ID of the task to add dependencies to
 * @param {string[]} dependencyIds - Array of task IDs that the task depends on
 * @returns {Promise<Object>} - Response data
 */
async function addDependenciesToTask(taskId, dependencyIds) {
  try {
    // Validate required parameters
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    if (!dependencyIds || !Array.isArray(dependencyIds) || dependencyIds.length === 0) {
      throw new Error('At least one dependency task ID is required');
    }
    
    console.debug(`Adding dependencies ${dependencyIds.join(', ')} to task ${taskId}`);
    
    const response = await axios.post(
      `${ASANA_BASE_URL}/tasks/${taskId}/addDependencies`,
      { 
        data: { 
          dependencies: dependencyIds 
        } 
      },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error adding dependencies to task:', error.response?.data || error.message);
    if (error.response) {
      console.debug('Response status:', error.response.status);
      console.debug('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Create a more detailed error message
      const errorDetails = error.response.data?.errors?.[0]?.message || JSON.stringify(error.response.data);
      const detailedError = new Error(`Asana API Error (${error.response.status}): ${errorDetails}`);
      
      // Attach the original error response for reference
      detailedError.originalResponse = error.response.data;
      detailedError.status = error.response.status;
      
      throw detailedError;
    }
    throw error;
  }
}

/**
 * Remove dependencies from a task
 * @param {string} taskId - The ID of the task to remove dependencies from
 * @param {string[]} dependencyIds - Array of task IDs to remove as dependencies
 * @returns {Promise<Object>} - Response data
 */
async function removeDependenciesFromTask(taskId, dependencyIds) {
  try {
    // Validate required parameters
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    if (!dependencyIds || !Array.isArray(dependencyIds) || dependencyIds.length === 0) {
      throw new Error('At least one dependency task ID is required');
    }
    
    console.debug(`Removing dependencies ${dependencyIds.join(', ')} from task ${taskId}`);
    
    const response = await axios.post(
      `${ASANA_BASE_URL}/tasks/${taskId}/removeDependencies`,
      { 
        data: { 
          dependencies: dependencyIds 
        } 
      },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error removing dependencies from task:', error.response?.data || error.message);
    if (error.response) {
      console.debug('Response status:', error.response.status);
      console.debug('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Create a more detailed error message
      const errorDetails = error.response.data?.errors?.[0]?.message || JSON.stringify(error.response.data);
      const detailedError = new Error(`Asana API Error (${error.response.status}): ${errorDetails}`);
      
      // Attach the original error response for reference
      detailedError.originalResponse = error.response.data;
      detailedError.status = error.response.status;
      
      throw detailedError;
    }
    throw error;
  }
}

/**
 * Get dependencies for a task
 * @param {string} taskId - The ID of the task to get dependencies for
 * @returns {Promise<Object>} - List of dependencies
 */
async function getDependenciesForTask(taskId) {
  try {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    console.debug(`Getting dependencies for task ${taskId}`);
    
    const response = await axios.get(
      `${ASANA_BASE_URL}/tasks/${taskId}/dependencies`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error getting dependencies for task:', error.response?.data || error.message);
    if (error.response) {
      console.debug('Response status:', error.response.status);
      console.debug('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Create a more detailed error message
      const errorDetails = error.response.data?.errors?.[0]?.message || JSON.stringify(error.response.data);
      const detailedError = new Error(`Asana API Error (${error.response.status}): ${errorDetails}`);
      
      // Attach the original error response for reference
      detailedError.originalResponse = error.response.data;
      detailedError.status = error.response.status;
      
      throw detailedError;
    }
    throw error;
  }
}

export { addDependenciesToTask, removeDependenciesFromTask, getDependenciesForTask };
