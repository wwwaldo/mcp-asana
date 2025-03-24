import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Command } from "commander";
// Create a command-line program
const program = new Command();
// Set up the program
program
    .name("asana-client")
    .description("Client for interacting with the Asana MCP server")
    .version("1.0.0");
// Function to create a client and connect to the server
async function createClient() {
    const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/server.js"]
    });
    const client = new Client({
        name: "asana-client",
        version: "1.0.0"
    }, {
        capabilities: {
            tools: {}
        }
    });
    try {
        await client.connect(transport);
        return client;
    }
    catch (error) {
        console.debug("Failed to connect to the server:", error);
        process.exit(1);
    }
}
// Command to create a task
program
    .command("create-task")
    .description("Create a new Asana task")
    .requiredOption("--name <name>", "Name of the task")
    .option("--description <description>", "Description of the task")
    .option("--due-date <dueDate>", "Due date of the task")
    .option("--assignee <assignee>", "Assignee of the task")
    .option("--project <project>", "Project to add the task to")
    .action(async (options) => {
    try {
        const client = await createClient();
        console.log("Creating task...");
        const result = await client.callTool({
            name: "create-task",
            arguments: {
                name: options.name,
                description: options.description,
                dueDate: options.dueDate,
                assignee: options.assignee,
                project: options.project
            }
        });
        console.log("Result:", JSON.stringify(result, null, 2));
        process.exit(0);
    }
    catch (error) {
        console.debug("Error:", error);
        process.exit(1);
    }
});
// Command to update a task
program
    .command("update-task")
    .description("Update an existing Asana task")
    .requiredOption("--task-id <taskId>", "ID of the task to update")
    .option("--name <name>", "New name of the task")
    .option("--description <description>", "New description of the task")
    .option("--due-date <dueDate>", "New due date of the task")
    .option("--assignee <assignee>", "New assignee of the task")
    .option("--completed <completed>", "Whether the task is completed", (value) => value === "true")
    .action(async (options) => {
    try {
        const client = await createClient();
        console.log("Updating task...");
        const result = await client.callTool({
            name: "update-task",
            arguments: {
                taskId: options.taskId,
                name: options.name,
                description: options.description,
                dueDate: options.dueDate,
                assignee: options.assignee,
                completed: options.completed
            }
        });
        console.log("Result:", JSON.stringify(result, null, 2));
        process.exit(0);
    }
    catch (error) {
        console.debug("Error:", error);
        process.exit(1);
    }
});
// Command to delete a task
program
    .command("delete-task")
    .description("Delete an Asana task")
    .requiredOption("--task-id <taskId>", "ID of the task to delete")
    .action(async (options) => {
    try {
        const client = await createClient();
        console.log("Deleting task...");
        const result = await client.callTool({
            name: "delete-task",
            arguments: {
                taskId: options.taskId
            }
        });
        console.log("Result:", JSON.stringify(result, null, 2));
        process.exit(0);
    }
    catch (error) {
        console.debug("Error:", error);
        process.exit(1);
    }
});
// Command to create a project
program
    .command("create-project")
    .description("Create a new Asana project")
    .requiredOption("--name <n>", "Name of the project")
    .option("--notes <notes>", "Notes for the project")
    .option("--color <color>", "Color for the project")
    .option("--is-public <isPublic>", "Whether the project is public", (value) => value === "true")
    .option("--workspace-id <workspaceId>", "Workspace ID for the project")
    .action(async (options) => {
    try {
        const client = await createClient();
        console.log("Creating project...");
        const result = await client.callTool({
            name: "create-project",
            arguments: {
                name: options.name,
                notes: options.notes,
                color: options.color,
                isPublic: options.isPublic,
                workspaceId: options.workspaceId
            }
        });
        console.log("Result:", JSON.stringify(result, null, 2));
        process.exit(0);
    }
    catch (error) {
        console.debug("Error:", error);
        process.exit(1);
    }
});
// Parse command-line arguments
program.parse();
