import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";
// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Import the Asana API functions
// We need to dynamically import since we're using ESM and the asana.js file uses CommonJS
let asanaApi = null;
async function loadAsanaApi() {
    try {
        // Use createRequire to import CommonJS modules in ESM
        const { createRequire } = await import('module');
        const require = createRequire(import.meta.url);
        asanaApi = require('../asana.js');
        console.log("Asana API loaded successfully");
    }
    catch (error) {
        console.error("Error loading Asana API:", error.message);
        console.log("Using stub implementations instead");
    }
}
// Create an MCP server
const server = new McpServer({
    name: "Asana Tasks Manager",
    version: "1.0.0"
});
// Define tool for creating a new Asana task
server.tool("create-task", {
    name: z.string(),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    assignee: z.string().optional(),
    project: z.string().optional()
}, async ({ name, description, dueDate, assignee, project }) => {
    console.log(`Creating Asana task: ${name}`);
    console.log(`Description: ${description || 'N/A'}`);
    console.log(`Due Date: ${dueDate || 'N/A'}`);
    console.log(`Assignee: ${assignee || 'N/A'}`);
    console.log(`Project: ${project || 'N/A'}`);
    try {
        if (asanaApi) {
            // Call the actual Asana API
            const result = await asanaApi.createTask(name, description, dueDate, assignee);
            console.log("Task created with ID:", result.data.gid);
            return {
                content: [{
                        type: "text",
                        text: `Task "${name}" created successfully with ID: ${result.data.gid}`
                    }]
            };
        }
        else {
            // Stub implementation
            return {
                content: [{
                        type: "text",
                        text: `Task "${name}" created successfully (stub)`
                    }]
            };
        }
    }
    catch (error) {
        console.error("Error creating task:", error);
        return {
            content: [{
                    type: "text",
                    text: `Error creating task: ${error.message || 'Unknown error'}`
                }]
        };
    }
});
// Define tool for listing tasks
server.tool("list-tasks", {
    projectId: z.string().optional()
}, async ({ projectId }) => {
    console.log("Listing Asana tasks");
    if (projectId) {
        console.log(`For project: ${projectId}`);
    }
    try {
        if (asanaApi) {
            // Call the actual Asana API
            const result = await asanaApi.listTasks();
            console.log(`Found ${result.data?.length || 0} tasks`);
            // Format tasks for display
            const taskList = result.data?.map((task) => {
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
            }
            else {
                responseText += "| ID | Name | Completed | Due Date |\n";
                responseText += "|---|------|-----------|----------|\n";
                taskList.forEach((task) => {
                    responseText += `| ${task.id} | ${task.name} | ${task.completed} | ${task.dueDate} |\n`;
                });
            }
            return {
                content: [{
                        type: "text",
                        text: responseText
                    }]
            };
        }
        else {
            // Stub implementation
            return {
                content: [{
                        type: "text",
                        text: "## Tasks (Stub)\n\n| ID | Name | Completed | Due Date |\n|---|------|-----------|----------|\n| 1234567890 | Example Task 1 | ✗ | 2025-04-01 |\n| 0987654321 | Example Task 2 | ✓ | 2025-03-15 |"
                    }]
            };
        }
    }
    catch (error) {
        console.error("Error listing tasks:", error);
        return {
            content: [{
                    type: "text",
                    text: `Error listing tasks: ${error.message || 'Unknown error'}`
                }]
        };
    }
});
// Define tool for updating an existing Asana task
server.tool("update-task", {
    taskId: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    assignee: z.string().optional(),
    completed: z.boolean().optional()
}, async ({ taskId, name, description, dueDate, assignee, completed }) => {
    console.log(`Updating Asana task: ${taskId}`);
    if (name)
        console.log(`New name: ${name}`);
    if (description)
        console.log(`New description: ${description}`);
    if (dueDate)
        console.log(`New due date: ${dueDate}`);
    if (assignee)
        console.log(`New assignee: ${assignee}`);
    if (completed !== undefined)
        console.log(`Completed: ${completed}`);
    try {
        if (asanaApi) {
            // Call the actual Asana API
            const updatedFields = {};
            if (name)
                updatedFields.name = name;
            if (description)
                updatedFields.notes = description;
            if (dueDate)
                updatedFields.due_on = dueDate;
            if (assignee)
                updatedFields.assignee = assignee;
            if (completed !== undefined)
                updatedFields.completed = completed;
            const result = await asanaApi.updateTask(taskId, updatedFields);
            console.log("Task updated successfully");
            return {
                content: [{
                        type: "text",
                        text: `Task ${taskId} updated successfully`
                    }]
            };
        }
        else {
            // Stub implementation
            return {
                content: [{
                        type: "text",
                        text: `Task ${taskId} updated successfully (stub)`
                    }]
            };
        }
    }
    catch (error) {
        console.error("Error updating task:", error);
        return {
            content: [{
                    type: "text",
                    text: `Error updating task: ${error.message || 'Unknown error'}`
                }]
        };
    }
});
// Define tool for deleting an Asana task
server.tool("delete-task", {
    taskId: z.string()
}, async ({ taskId }) => {
    console.log(`Deleting Asana task: ${taskId}`);
    try {
        if (asanaApi) {
            // Call the actual Asana API
            await asanaApi.deleteTask(taskId);
            console.log("Task deleted successfully");
            return {
                content: [{
                        type: "text",
                        text: `Task ${taskId} deleted successfully`
                    }]
            };
        }
        else {
            // Stub implementation
            return {
                content: [{
                        type: "text",
                        text: `Task ${taskId} deleted successfully (stub)`
                    }]
            };
        }
    }
    catch (error) {
        console.error("Error deleting task:", error);
        return {
            content: [{
                    type: "text",
                    text: `Error deleting task: ${error.message || 'Unknown error'}`
                }]
        };
    }
});
// Function to start the server with stdio transport (for command-line usage)
async function startStdioServer() {
    // Load the Asana API
    await loadAsanaApi();
    const transport = new StdioServerTransport();
    // Add debug logging
    process.stdin.on('data', (data) => {
        try {
            const message = JSON.parse(data.toString().trim());
            console.error(`Received message: ${JSON.stringify(message)}`);
        }
        catch (error) {
            console.error(`Error parsing message: ${error}`);
        }
    });
    await server.connect(transport);
    console.log("MCP Asana server running with stdio transport");
    console.log("Use tools: create-task, list-tasks, update-task, delete-task");
}
// Determine which transport to use based on command-line arguments
if (process.argv.includes("--http")) {
    console.log("HTTP transport is not supported in this version due to compatibility issues.");
    console.log("Please use stdio transport instead by running without the --http flag.");
    process.exit(1);
}
else {
    startStdioServer();
}
