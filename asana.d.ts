// Type definitions for asana.js
export function createTask(name: string, notes?: string, dueDate?: string | null, assignee?: string | null, projectId?: string | null): Promise<any>;
export function listTasks(): Promise<any>;
export function updateTask(taskId: string, updatedFields: any): Promise<any>;
export function completeTask(taskId: string): Promise<any>;
export function deleteTask(taskId: string): Promise<any>;
