import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup custom logging to ensure stdout is only used for MCP JSON messages
// Override console.log to use stderr instead of stdout
const originalConsoleLog = console.log;
console.log = function(...args: any[]) {
  console.debug(...args);
};

// Import the Asana API functions
let asanaApi: any = null;

async function loadAsanaApi() {
  try {
    // Import the ES module version of asana.js
    asanaApi = await import('../asana/index.js');
    console.debug("Asana API loaded successfully");
  } catch (error: any) {
    console.debug("Error loading Asana API:", error.message);
    console.debug("Using stub implementations instead");
  }
}

// Create an MCP server
const server = new McpServer({
  name: "Asana Tasks Manager",
  version: "1.0.0"
});

// Define tool for creating a new Asana task
server.tool(
  "create-task",
  {
    name: z.string(),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    assignee: z.string().optional(),
    project: z.string().optional()
  },
  async ({ name, description, dueDate, assignee, project }) => {
    console.debug(`Creating Asana task: ${name}`);
    console.debug(`Description: ${description || 'N/A'}`);
    console.debug(`Due Date: ${dueDate || 'N/A'}`);
    console.debug(`Assignee: ${assignee || 'N/A'}`);
    console.debug(`Project: ${project || 'N/A'}`);
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.createTask(name, description, dueDate, assignee, project);
        console.debug("Task created with ID:", result.data.gid);
        
        return {
          content: [{ 
            type: "text", 
            text: `Task "${name}" created successfully with ID: ${result.data.gid}` 
          }]
        };
      } else {
        // Stub implementation
        return {
          content: [{ 
            type: "text", 
            text: `Task "${name}" created successfully (stub)` 
          }]
        };
      }
    } catch (error: any) {
      console.debug("Error creating task:", error);
      return {
        content: [{ 
          type: "text", 
          text: `Error creating task: ${error.message || 'Unknown error'}` 
        }]
      };
    }
  }
);

// Define tool for listing tasks
server.tool(
  "list-tasks",
  {
    projectId: z.string().optional()
  },
  async ({ projectId }) => {
    console.debug("Listing Asana tasks");
    if (projectId) {
      console.debug(`For project: ${projectId}`);
    }
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.listTasks();
        console.debug(`Found ${result.data?.length || 0} tasks`);
        
        // Format tasks for display
        const taskList = result.data?.map((task: any) => {
          return {
            id: task.gid,
            name: task.name,
            completed: task.completed ? "✓" : "✗",
            dueDate: task.due_on || "No due date"
          };
        }) || [];
        
        // Create a formatted response
        let responseText = "## Tasks\n\n";
        
        if (taskList.length === 0) {
          responseText += "No tasks found.";
        } else {
          responseText += "| ID | Name | Completed | Due Date |\n";
          responseText += "|---|------|-----------|----------|\n";
          
          taskList.forEach((task: any) => {
            responseText += `| ${task.id} | ${task.name} | ${task.completed} | ${task.dueDate} |\n`;
          });
        }
        
        return {
          content: [{ 
            type: "text", 
            text: responseText
          }]
        };
      } else {
        // Stub implementation
        return {
          content: [{ 
            type: "text", 
            text: "## Tasks (Stub)\n\n| ID | Name | Completed | Due Date |\n|---|------|-----------|----------|\n| 1234567890 | Example Task 1 | ✗ | 2025-04-01 |\n| 0987654321 | Example Task 2 | ✓ | 2025-03-15 |"
          }]
        };
      }
    } catch (error: any) {
      console.debug("Error listing tasks:", error);
      return {
        content: [{ 
          type: "text", 
          text: `Error listing tasks: ${error.message || 'Unknown error'}` 
        }]
      };
    }
  }
);

// Define tool for updating an existing Asana task
server.tool(
  "update-task",
  {
    taskId: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    assignee: z.string().optional(),
    completed: z.boolean().optional()
  },
  async ({ taskId, name, description, dueDate, assignee, completed }) => {
    console.debug(`Updating Asana task: ${taskId}`);
    
    if (name) console.debug(`New name: ${name}`);
    if (description) console.debug(`New description: ${description}`);
    if (dueDate) console.debug(`New due date: ${dueDate}`);
    if (assignee) console.debug(`New assignee: ${assignee}`);
    if (completed !== undefined) console.debug(`Completed: ${completed}`);
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        const updatedFields: any = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.notes = description;
        if (dueDate) updatedFields.due_on = dueDate;
        if (assignee) updatedFields.assignee = assignee;
        if (completed !== undefined) updatedFields.completed = completed;
        
        const result = await asanaApi.updateTask(taskId, updatedFields);
        console.debug("Task updated successfully");
        
        return {
          content: [{ 
            type: "text", 
            text: `Task ${taskId} updated successfully` 
          }]
        };
      } else {
        // Stub implementation
        return {
          content: [{ 
            type: "text", 
            text: `Task ${taskId} updated successfully (stub)` 
          }]
        };
      }
    } catch (error: any) {
      console.debug("Error updating task:", error);
      return {
        content: [{ 
          type: "text", 
          text: `Error updating task: ${error.message || 'Unknown error'}` 
        }]
      };
    }
  }
);

// Define tool for deleting a task
server.tool(
  "delete-task",
  {
    taskId: z.string()
  },
  async ({ taskId }) => {
    console.debug(`Deleting task: ${taskId}`);
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        await asanaApi.deleteTask(taskId);
        console.debug("Task deleted successfully");
        
        return {
          content: [
            {
              type: "text",
              text: `Task ${taskId} deleted successfully`
            }
          ]
        };
      } else {
        // Stub implementation
        console.debug("Using stub implementation for delete-task");
        
        return {
          content: [
            {
              type: "text",
              text: `Task ${taskId} deleted successfully (stub implementation)`
            }
          ]
        };
      }
    } catch (error: any) {
      console.debug("Error deleting task:", error.message);
      
      return {
        content: [
          {
            type: "text",
            text: `Error deleting task: ${error.message}`
          }
        ]
      };
    }
  }
);

// Define tool for creating a new project
server.tool(
  "create-project",
  {
    name: z.string(),
    notes: z.string().optional(),
    color: z.string().optional(),
    isPublic: z.boolean().optional(),
    workspaceId: z.string().optional()
  },
  async ({ name, notes, color, isPublic, workspaceId }) => {
    console.debug(`Creating Asana project: ${name}`);
    console.debug(`Notes: ${notes || 'N/A'}`);
    console.debug(`Color: ${color || 'N/A'}`);
    console.debug(`Public: ${isPublic !== undefined ? isPublic : 'N/A'}`);
    console.debug(`Workspace ID: ${workspaceId || 'Using default from .env'}`);
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.createProject(name, notes, color, isPublic, workspaceId);
        console.debug("Project created with ID:", result.data.gid);
        
        return {
          content: [
            {
              type: "text",
              text: `Project "${name}" created successfully with ID: ${result.data.gid}`
            }
          ]
        };
      } else {
        // Stub implementation
        console.debug("Using stub implementation for create-project");
        const projectId = Math.floor(Math.random() * 10000000000);
        
        return {
          content: [
            {
              type: "text",
              text: `Project "${name}" created successfully with ID: ${projectId} (stub implementation)`
            }
          ]
        };
      }
    } catch (error: any) {
      console.debug("Error creating project:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating project: ${error.message || error.error?.errors[0].message || 'Unknown error'}` 
          }
        ]
      };
    }
  }
);

// Define tool for deleting a project
server.tool(
  "delete-project",
  {
    projectId: z.string()
  },
  async ({ projectId }) => {
    console.debug(`Deleting project: ${projectId}`);
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        await asanaApi.deleteProject(projectId);
        console.debug("Project deleted successfully");
        
        return {
          content: [
            {
              type: "text",
              text: `Project ${projectId} deleted successfully`
            }
          ]
        };
      } else {
        // Stub implementation
        console.debug("Using stub implementation for delete-project");
        
        return {
          content: [
            {
              type: "text",
              text: `Project ${projectId} deleted successfully (stub implementation)`
            }
          ]
        };
      }
    } catch (error: any) {
      console.debug("Error deleting project:", error.message);
      
      return {
        content: [
          {
            type: "text",
            text: `Error deleting project: ${error.message}`
          }
        ]
      };
    }
  }
);

// Define tool for listing projects
server.tool(
  "list-projects",
  {
    workspaceId: z.string().optional().nullable()
  },
  async ({ workspaceId }) => {
    console.debug(`Listing projects${workspaceId ? ` in workspace ${workspaceId}` : ''}`);
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.listProjects(workspaceId);
        console.debug(`Found ${result.data?.length || 0} projects`);
        
        // Format projects for display
        if (result.data && result.data.length > 0) {
          // Create a markdown table
          let markdown = "## Projects\n\n";
          markdown += "| ID | Name | Notes |\n";
          markdown += "|---|------|-------|\n";
          
          result.data.forEach((project: any) => {
            markdown += `| ${project.gid} | ${project.name} | ${project.notes ? project.notes.substring(0, 50) + (project.notes.length > 50 ? '...' : '') : 'No notes'} |\n`;
          });
          
          return {
            content: [
              {
                type: "text",
                text: markdown
              }
            ]
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: "## Projects\n\nNo projects found."
              }
            ]
          };
        }
      } else {
        // Stub implementation
        console.debug("Using stub implementation for list-projects");
        
        return {
          content: [
            {
              type: "text",
              text: "## Projects\n\nNo projects found (stub implementation)."
            }
          ]
        };
      }
    } catch (error: any) {
      console.debug("Error listing projects:", error.message);
      
      return {
        content: [
          {
            type: "text",
            text: `Error listing projects: ${error.message}`
          }
        ]
      };
    }
  }
);

// Define tool for creating sections
server.tool(
  "create-section",
  {
    projectId: z.string(),
    name: z.string(),
    insertBefore: z.string().optional(),
    insertAfter: z.string().optional()
  },
  async ({ projectId, name, insertBefore, insertAfter }) => {
    console.debug(`Creating section "${name}" in project ${projectId}`);
    if (insertBefore) console.debug(`Insert before: ${insertBefore}`);
    if (insertAfter) console.debug(`Insert after: ${insertAfter}`);
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.createSection(projectId, name, insertBefore, insertAfter);
        console.debug("Section created with ID:", result.data.gid);
        
        return {
          content: [
            { 
              type: "text", 
              text: `Section "${name}" created successfully in project ${projectId} with ID: ${result.data.gid}`
            }
          ]
        };
      } else {
        // Stub implementation
        console.debug("Using stub implementation for create-section");
        const sectionId = Math.floor(Math.random() * 10000000000);
        
        return {
          content: [
            { 
              type: "text", 
              text: `Section "${name}" created successfully in project ${projectId} with ID: ${sectionId} (stub implementation)`
            }
          ]
        };
      }
    } catch (error: any) {
      console.debug("Error creating section:", error);
      
      return {
        content: [
          {
            type: "text",
            text: `Error creating section: ${error.message || error.originalResponse?.errors?.[0]?.message || 'Unknown error'}`
          }
        ]
      };
    }
  }
);

// Define tool for adding a task to a section
server.tool(
  "add-task-to-section",
  {
    sectionId: z.string(),
    taskId: z.string()
  },
  async ({ sectionId, taskId }) => {
    console.debug(`Adding task ${taskId} to section ${sectionId}`);
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.addTaskToSection(sectionId, taskId);
        console.debug("Task added to section successfully");
        
        return {
          content: [
            { 
              type: "text", 
              text: `Task ${taskId} added to section ${sectionId} successfully`
            }
          ]
        };
      } else {
        // Stub implementation
        console.debug("Using stub implementation for add-task-to-section");
        
        return {
          content: [
            { 
              type: "text", 
              text: `Task ${taskId} added to section ${sectionId} successfully (stub implementation)`
            }
          ]
        };
      }
    } catch (error: any) {
      console.debug("Error adding task to section:", error);
      
      // Re-throw the error as a response
      return {
        content: [
          {
            type: "text",
            text: `Error adding task to section: ${error.message || error.originalResponse?.errors?.[0]?.message || 'Unknown error'}`
          }
        ]
      };
    }
  }
);

// Define tool for adding dependencies to a task
server.tool(
  "add-dependencies",
  {
    taskId: z.string(),
    dependencyIds: z.array(z.string())
  },
  async ({ taskId, dependencyIds }) => {
    console.debug(`Adding dependencies ${dependencyIds.join(', ')} to task ${taskId}`);
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.addDependenciesToTask(taskId, dependencyIds);
        console.debug("Dependencies added successfully");
        
        return {
          content: [
            { 
              type: "text", 
              text: `Dependencies ${dependencyIds.join(', ')} added to task ${taskId} successfully`
            }
          ]
        };
      } else {
        // Stub implementation
        console.debug("Using stub implementation for add-dependencies");
        
        return {
          content: [
            { 
              type: "text", 
              text: `Dependencies ${dependencyIds.join(', ')} added to task ${taskId} successfully (stub implementation)`
            }
          ]
        };
      }
    } catch (error: any) {
      console.debug("Error adding dependencies to task:", error);
      
      // Re-throw the error as a response
      return {
        content: [
          {
            type: "text",
            text: `Error adding dependencies to task: ${error.message || error.originalResponse?.errors?.[0]?.message || 'Unknown error'}`
          }
        ]
      };
    }
  }
);

// Define tool for removing dependencies from a task
server.tool(
  "remove-dependencies",
  {
    taskId: z.string(),
    dependencyIds: z.array(z.string())
  },
  async ({ taskId, dependencyIds }) => {
    console.debug(`Removing dependencies ${dependencyIds.join(', ')} from task ${taskId}`);
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.removeDependenciesFromTask(taskId, dependencyIds);
        console.debug("Dependencies removed successfully");
        
        return {
          content: [
            { 
              type: "text", 
              text: `Dependencies ${dependencyIds.join(', ')} removed from task ${taskId} successfully`
            }
          ]
        };
      } else {
        // Stub implementation
        console.debug("Using stub implementation for remove-dependencies");
        
        return {
          content: [
            { 
              type: "text", 
              text: `Dependencies ${dependencyIds.join(', ')} removed from task ${taskId} successfully (stub implementation)`
            }
          ]
        };
      }
    } catch (error: any) {
      console.debug("Error removing dependencies from task:", error);
      
      // Re-throw the error as a response
      return {
        content: [
          {
            type: "text",
            text: `Error removing dependencies from task: ${error.message || error.originalResponse?.errors?.[0]?.message || 'Unknown error'}`
          }
        ]
      };
    }
  }
);

// Define tool for getting dependencies for a task
server.tool(
  "get-dependencies",
  {
    taskId: z.string()
  },
  async ({ taskId }) => {
    console.debug(`Getting dependencies for task ${taskId}`);
    
    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.getDependenciesForTask(taskId);
        console.debug("Dependencies retrieved successfully:", result.data);
        
        // Format the dependencies for display
        const dependencies = result.data.map((dep: any) => ({
          id: dep.gid,
          name: dep.name,
          completed: dep.completed
        }));
        
        return {
          content: [
            { 
              type: "text", 
              text: `Dependencies for task ${taskId}:`
            },
            {
              type: "text",
              text: JSON.stringify(dependencies, null, 2)
            }
          ]
        };
      } else {
        // Stub implementation
        console.debug("Using stub implementation for get-dependencies");
        
        return {
          content: [
            { 
              type: "text", 
              text: `Dependencies for task ${taskId} (stub implementation):`
            },
            {
              type: "text",
              text: JSON.stringify([
                { id: "12345", name: "Stub dependency 1", completed: false },
                { id: "67890", name: "Stub dependency 2", completed: true }
              ], null, 2)
            }
          ]
        };
      }
    } catch (error: any) {
      console.debug("Error getting dependencies for task:", error);
      
      // Re-throw the error as a response
      return {
        content: [
          {
            type: "text",
            text: `Error getting dependencies for task: ${error.message || error.originalResponse?.errors?.[0]?.message || 'Unknown error'}`
          }
        ]
      };
    }
  }
);

// Function to start the server with stdio transport (for command-line usage)
async function startStdioServer() {
  await loadAsanaApi();
  
  const transport = new StdioServerTransport();
  
  // Add debug logging
  process.stdin.on('data', (data) => {
    try {
      const message = JSON.parse(data.toString().trim());
      console.debug(`Received message: ${JSON.stringify(message)}`);
    } catch (error) {
      console.debug(`Error parsing message: ${error}`);
    }
  });
  
  await server.connect(transport);
  console.debug("MCP Asana server running with stdio transport");
  console.debug("Use tools: create-task, list-tasks, update-task, delete-task, create-project, list-projects, delete-project, create-section, add-task-to-section, add-dependencies, remove-dependencies, get-dependencies");
}

// Determine which transport to use based on command-line arguments
if (process.argv.includes("--http")) {
  console.debug("HTTP transport is not supported in this version due to compatibility issues.");
  console.debug("Please use stdio transport instead by running without the --http flag.");
  process.exit(1);
} else {
  startStdioServer();
}
