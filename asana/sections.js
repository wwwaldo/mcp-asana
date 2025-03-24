// Asana Sections API integration
import axios from 'axios';
import { getHeaders, ASANA_BASE_URL } from './config.js';

// Define a custom error class for Asana API errors
class AsanaApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AsanaApiError';
  }
}

/**
 * Create a new section in a project
 * @param {string} projectId - The ID of the project to create the section in
 * @param {string} name - The name of the section
 * @param {string} insertBefore - Optional ID of the section to insert this section before
 * @param {string} insertAfter - Optional ID of the section to insert this section after
 * @returns {Promise<Object>} - The created section data
 */
async function createSection(projectId, name, insertBefore, insertAfter) {
  try {
    // Validate required parameters
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    if (!name) {
      throw new Error('Section name is required');
    }
    
    const sectionData = {
      name
    };

    // Add optional parameters if provided
    if (insertBefore) {
      sectionData.insert_before = insertBefore;
    } else if (insertAfter) {
      sectionData.insert_after = insertAfter;
    }

    console.debug('Creating section with data:', JSON.stringify(sectionData, null, 2));
    
    const response = await axios.post(
      `${ASANA_BASE_URL}/projects/${projectId}/sections`,
      { data: sectionData },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error creating section:', error.response?.data || error.message);
    if (error.response) {
      console.debug('Response status:', error.response.status);
      console.debug('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Create a more detailed error message that includes the Asana API error details
      const errorDetails = error.response.data?.errors?.[0]?.message || JSON.stringify(error.response.data);
      const detailedError = new AsanaApiError(`Asana API Error (${error.response.status}): ${errorDetails}`);
      
      // Attach the original error response for reference
      detailedError.originalResponse = error.response.data;
      detailedError.status = error.response.status;
      
      throw detailedError;
    }
    throw error;
  }
}

/**
 * List sections in a project
 * @param {string} projectId - The ID of the project to list sections from
 * @returns {Promise<Object>} - The list of sections
 */
async function listSections(projectId) {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    console.debug(`Listing sections in project ${projectId}`);
    
    const response = await axios.get(
      `${ASANA_BASE_URL}/projects/${projectId}/sections`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error listing sections:', error.response?.data || error.message);
    if (error.response) {
      console.debug('Response status:', error.response.status);
      console.debug('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Create a more detailed error message
      const errorDetails = error.response.data?.errors?.[0]?.message || JSON.stringify(error.response.data);
      const detailedError = new AsanaApiError(`Asana API Error (${error.response.status}): ${errorDetails}`);
      
      // Attach the original error response for reference
      detailedError.originalResponse = error.response.data;
      detailedError.status = error.response.status;
      
      throw detailedError;
    }
    throw error;
  }
}

/**
 * Add a task to a section
 * @param {string} sectionId - The ID of the section to add the task to
 * @param {string} taskId - The ID of the task to add
 * @returns {Promise<Object>} - Response data
 */
async function addTaskToSection(sectionId, taskId) {
  try {
    // Validate required parameters
    if (!sectionId) {
      throw new Error('Section ID is required');
    }
    
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    console.debug(`Adding task ${taskId} to section ${sectionId}`);
    
    const response = await axios.post(
      `${ASANA_BASE_URL}/sections/${sectionId}/addTask`,
      { 
        data: { 
          task: taskId 
        } 
      },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error adding task to section:', error.response?.data || error.message);
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

export { createSection, listSections, addTaskToSection };
