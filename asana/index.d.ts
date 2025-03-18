// Type definitions for Asana API

// Config exports
export const ASANA_BASE_URL: string;
export const ASANA_ACCESS_TOKEN: string;
export const PROJECT_ID: number;
export const WORKSPACE_ID: number;
export function getHeaders(): { Authorization: string; 'Content-Type': string };

// Tasks exports
export function createTask(name: string, notes?: string, dueDate?: string | null, assignee?: string | null, projectId?: string | null): Promise<any>;
export function listTasks(projectId?: string | null): Promise<any>;
export function updateTask(taskId: string, updatedFields: any): Promise<any>;
export function completeTask(taskId: string): Promise<any>;
export function deleteTask(taskId: string): Promise<any>;

// Projects exports
export function createProject(name: string, notes?: string, color?: string | null, isPublic?: boolean, workspaceId?: string | null): Promise<any>;
export function deleteProject(projectId: string): Promise<any>;
export function listProjects(workspaceId?: string | null): Promise<any>;
export function getProject(projectId: string): Promise<any>;
export function updateProject(projectId: string, updatedFields: any): Promise<any>;
