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
    const projectData = {
      name,
      notes,
      workspace: workspaceId || WORKSPACE_ID,
      public: isPublic
    };

    if (color) projectData.color = color;

    console.log('Creating project with data:', JSON.stringify(projectData, null, 2));
    
    const response = await axios.post(
      `${ASANA_BASE_URL}/projects`,
      { data: projectData },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error.response?.data || error.message);
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
    console.log(`Deleting project ${projectId}`);
    
    const response = await axios.delete(
      `${ASANA_BASE_URL}/projects/${projectId}`,
      { headers: getHeaders() }
    );
    return { success: true, projectId };
  } catch (error) {
    console.error('Error deleting project:', error.response?.data || error.message);
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
    console.log(`Listing projects in workspace ${targetWorkspaceId}`);
    
    const response = await axios.get(
      `${ASANA_BASE_URL}/workspaces/${targetWorkspaceId}/projects`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error listing projects:', error.response?.data || error.message);
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
    console.log(`Getting project ${projectId}`);
    
    const response = await axios.get(
      `${ASANA_BASE_URL}/projects/${projectId}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting project:', error.response?.data || error.message);
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
    console.log(`Updating project ${projectId} with data:`, JSON.stringify(updatedFields, null, 2));
    
    const response = await axios.put(
      `${ASANA_BASE_URL}/projects/${projectId}`,
      { data: updatedFields },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error.response?.data || error.message);
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
