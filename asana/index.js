// Export all Asana API functions
import * as projectsApi from './projects.js';
import * as tasksApi from './tasks.js';
import * as sectionsApi from './sections.js';
import * as dependenciesApi from './dependencies.js';

// Re-export all functions
export const createProject = projectsApi.createProject;
export const deleteProject = projectsApi.deleteProject;
export const listProjects = projectsApi.listProjects;
export const getProject = projectsApi.getProject;
export const updateProject = projectsApi.updateProject;

export const createTask = tasksApi.createTask;
export const listTasks = tasksApi.listTasks;
export const updateTask = tasksApi.updateTask;
export const completeTask = tasksApi.completeTask;
export const deleteTask = tasksApi.deleteTask;

export const createSection = sectionsApi.createSection;
export const listSections = sectionsApi.listSections;
export const addTaskToSection = sectionsApi.addTaskToSection;

export const addDependenciesToTask = dependenciesApi.addDependenciesToTask;
export const removeDependenciesFromTask = dependenciesApi.removeDependenciesFromTask;
export const getDependenciesForTask = dependenciesApi.getDependenciesForTask;
