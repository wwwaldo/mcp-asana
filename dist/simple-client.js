import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main() {
    // Get command line arguments
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log("Usage:");
        console.log("  node dist/simple-client.js create-task \"Task Name\" \"Description\" \"Due Date\" \"Assignee\" \"Project\"");
        console.log("  node dist/simple-client.js list-tasks [\"ProjectId\"]");
        console.log("  node dist/simple-client.js update-task \"TaskId\" \"New Name\" \"New Description\" \"New Due Date\" \"New Assignee\" \"true|false\"");
        console.log("  node dist/simple-client.js delete-task \"TaskId\"");
        process.exit(1);
    }
    const command = args[0];
    // Start the server as a separate process
    const serverPath = path.join(__dirname, "..", "dist", "server.js");
    const serverProcess = spawn("node", [serverPath]);
    // Create a transport that connects to the server process
    const transport = new StdioClientTransport({
        command: "node",
        args: [serverPath]
    });
    // Create the client
    const client = new Client({
        name: "asana-client",
        version: "1.0.0"
    }, {
        capabilities: {
            tools: {}
        }
    });
    try {
        // Connect to the server
        await client.connect(transport);
        console.log("Connected to server");
        // Execute the appropriate command
        switch (command) {
            case "create-task":
                await createTask(client, args);
                break;
            case "list-tasks":
                await listTasks(client, args);
                break;
            case "update-task":
                await updateTask(client, args);
                break;
            case "delete-task":
                await deleteTask(client, args);
                break;
            default:
                console.error(`Unknown command: ${command}`);
                process.exit(1);
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
        // Kill the server process
        serverProcess.kill();
        // Explicitly exit the process
        process.exit(0);
    }
}
async function createTask(client, args) {
    console.log("Creating task...");
    const result = await client.callTool({
        name: "create-task",
        arguments: {
            name: args[1] || "New Task",
            description: args[2],
            dueDate: args[3],
            assignee: args[4],
            project: args[5]
        }
    });
    console.log("Result:", JSON.stringify(result, null, 2));
}
async function listTasks(client, args) {
    console.log("Listing tasks...");
    const result = await client.callTool({
        name: "list-tasks",
        arguments: {
            projectId: args[1]
        }
    });
    // For list-tasks, we want to display the formatted text directly
    if (result.content && Array.isArray(result.content) && result.content.length > 0 && result.content[0]?.text) {
        console.log("\n" + result.content[0].text);
    }
    else {
        console.log("Result:", JSON.stringify(result, null, 2));
    }
}
async function updateTask(client, args) {
    console.log("Updating task...");
    const result = await client.callTool({
        name: "update-task",
        arguments: {
            taskId: args[1],
            name: args[2],
            description: args[3],
            dueDate: args[4],
            assignee: args[5],
            completed: args[6] === "true"
        }
    });
    console.log("Result:", JSON.stringify(result, null, 2));
}
async function deleteTask(client, args) {
    console.log("Deleting task...");
    const result = await client.callTool({
        name: "delete-task",
        arguments: {
            taskId: args[1]
        }
    });
    console.log("Result:", JSON.stringify(result, null, 2));
}
// Run the main function
main().catch(error => {
    console.error("Unhandled error:", error);
    process.exit(1);
});
