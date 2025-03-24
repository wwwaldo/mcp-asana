// Asana Projects API integration
import axios from 'axios';
import { getHeaders, ASANA_BASE_URL, WORKSPACE_ID } from './config.js';

/**
 * Create a new project in Asana
 * @param {string} name - The name of the project
 * @param {string} notes - Optional notes about the project
 * @param {string} color - Optional color for the project (light-green, dark-green, light-blue, etc.)
 * @param {boolean} isPublic - Optional flag to make the project public to the team
 * @param {string} workspaceId - Optional workspace ID (uses default if not provided)
 * @returns {Promise<Object>} - The created project data
 */
async function createProject(name, notes = '', color = null, isPublic = true, workspaceId = null) {
  try {
    const targetWorkspaceId = workspaceId || WORKSPACE_ID;
    
    // Validate required parameters
    if (!name) {
      throw new Error('Project name is required');
    }
    
    if (!targetWorkspaceId) {
      throw new Error('Workspace ID is required. Set ASANA_WORKSPACE_ID in .env or pass it as a parameter');
    }
    
    const projectData = {
      name,
      notes,
      workspace: targetWorkspaceId
    };

    if (color) projectData.color = color;

    console.debug('Creating project with data:', JSON.stringify(projectData, null, 2));
    
    const response = await axios.post(
      `${ASANA_BASE_URL}/projects`,
      { data: projectData },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error creating project:', error.response?.data || error.message);
    if (error.response) {
      console.debug('Response status:', error.response.status);
      console.debug('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Create a more detailed error message that includes the Asana API error details
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
 * Delete a project from Asana
 * @param {string} projectId - The ID of the project to delete
 * @returns {Promise<Object>} - Success status and project ID
 */
async function deleteProject(projectId) {
  try {
    console.debug(`Deleting project ${projectId}`);
    
    const response = await axios.delete(
      `${ASANA_BASE_URL}/projects/${projectId}`,
      { headers: getHeaders() }
    );
    return { success: true, projectId };
  } catch (error) {
    console.debug('Error deleting project:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * List all projects in a workspace
 * @param {string} workspaceId - Optional workspace ID (uses default if not provided)
 * @returns {Promise<Object>} - List of projects
 */
async function listProjects(workspaceId = null) {
  try {
    const targetWorkspaceId = workspaceId || WORKSPACE_ID;
    console.debug(`Listing projects in workspace ${targetWorkspaceId}`);
    
    const response = await axios.get(
      `${ASANA_BASE_URL}/workspaces/${targetWorkspaceId}/projects`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error listing projects:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get project details
 * @param {string} projectId - The ID of the project
 * @returns {Promise<Object>} - Project details
 */
async function getProject(projectId) {
  try {
    console.debug(`Getting project ${projectId}`);
    
    const response = await axios.get(
      `${ASANA_BASE_URL}/projects/${projectId}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error getting project:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Update a project in Asana
 * @param {string} projectId - The ID of the project to update
 * @param {Object} updatedFields - Fields to update
 * @returns {Promise<Object>} - The updated project data
 */
async function updateProject(projectId, updatedFields) {
  try {
    console.debug(`Updating project ${projectId} with data:`, JSON.stringify(updatedFields, null, 2));
    
    const response = await axios.put(
      `${ASANA_BASE_URL}/projects/${projectId}`,
      { data: updatedFields },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error updating project:', error.response?.data || error.message);
    throw error;
  }
}

export {
  createProject,
  deleteProject,
  listProjects,
  getProject,
  updateProject
};
