// Type definitions for config.js
export const ASANA_BASE_URL: string;
export const ASANA_ACCESS_TOKEN: string;
export const PROJECT_ID: string | null;
export const WORKSPACE_ID: string | null;

export function getHeaders(): Record<string, string>;
