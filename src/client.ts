import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Command } from "commander";

// Define interfaces for command options
interface CreateTaskOptions {
  name: string;
  description?: string;
  dueDate?: string;
  assignee?: string;
  project?: string;
}

interface UpdateTaskOptions {
  taskId: string;
  name?: string;
  description?: string;
  dueDate?: string;
  assignee?: string;
  completed?: boolean;
}

interface DeleteTaskOptions {
  taskId: string;
}

interface CreateProjectOptions {
  name: string;
  notes?: string;
  color?: string;
  isPublic?: boolean;
  workspaceId?: string;
}

interface CreateSectionOptions {
  projectId: string;
  name: string;
  insertBefore?: string;
  insertAfter?: string;
}

interface AddTaskToSectionOptions {
  sectionId: string;
  taskId: string;
}

interface DependencyOptions {
  taskId: string;
  dependencyIds?: string;
}

interface ListTasksOptions {
  projectId: string;
}

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

  const client = new Client(
    {
      name: "asana-client",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  try {
    await client.connect(transport);
    return client;
  } catch (error) {
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
  .action(async (options: CreateTaskOptions) => {
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
    } catch (error) {
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
  .option("--completed <completed>", "Whether the task is completed", (value: string) => value === "true")
  .action(async (options: UpdateTaskOptions) => {
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
    } catch (error) {
      console.debug("Error:", error);
      process.exit(1);
    }
  });

// Command to delete a task
program
  .command("delete-task")
  .description("Delete an Asana task")
  .requiredOption("--task-id <taskId>", "ID of the task to delete")
  .action(async (options: DeleteTaskOptions) => {
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
    } catch (error) {
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
  .option("--is-public <isPublic>", "Whether the project is public", (value: string) => value === "true")
  .option("--workspace-id <workspaceId>", "Workspace ID for the project")
  .action(async (options: CreateProjectOptions) => {
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
    } catch (error) {
      console.debug("Error:", error);
      process.exit(1);
    }
  });

// Command to create a section
program
  .command("create-section")
  .description("Create a new section in an Asana project")
  .requiredOption("--project-id <projectId>", "ID of the project to create the section in")
  .requiredOption("--name <n>", "Name of the section")
  .option("--insert-before <insertBefore>", "ID of the section to insert this section before")
  .option("--insert-after <insertAfter>", "ID of the section to insert this section after")
  .action(async (options: CreateSectionOptions) => {
    try {
      const client = await createClient();
      
      console.log("Creating section...");
      const result = await client.callTool({
        name: "create-section",
        arguments: {
          projectId: options.projectId,
          name: options.name,
          insertBefore: options.insertBefore,
          insertAfter: options.insertAfter
        }
      });
      
      console.log("Result:", JSON.stringify(result, null, 2));
      process.exit(0);
    } catch (error) {
      console.debug("Error:", error);
      process.exit(1);
    }
  });

// Command to add a task to a section
program
  .command("add-task-to-section")
  .description("Add a task to a section in Asana")
  .requiredOption("--section-id <sectionId>", "ID of the section to add the task to")
  .requiredOption("--task-id <taskId>", "ID of the task to add to the section")
  .action(async (options: AddTaskToSectionOptions) => {
    try {
      const client = await createClient();
      
      console.log("Adding task to section...");
      const result = await client.callTool({
        name: "add-task-to-section",
        arguments: {
          sectionId: options.sectionId,
          taskId: options.taskId
        }
      });
      
      console.log("Result:", JSON.stringify(result, null, 2));
      process.exit(0);
    } catch (error) {
      console.debug("Error:", error);
      process.exit(1);
    }
  });

// Command to add dependencies to a task
program
  .command("add-dependencies")
  .description("Add dependencies to a task in Asana (REQUIRES PREMIUM ASANA ACCOUNT)")
  .requiredOption("--task-id <taskId>", "ID of the task to add dependencies to")
  .requiredOption("--dependency-ids <dependencyIds>", "Comma-separated list of task IDs that the task depends on")
  .action(async (options: DependencyOptions) => {
    try {
      const client = await createClient();
      
      // Parse the comma-separated list of dependency IDs
      const dependencyIds = options.dependencyIds?.split(',') || [];
      
      console.log("Adding dependencies to task...");
      const result = await client.callTool({
        name: "add-dependencies",
        arguments: {
          taskId: options.taskId,
          dependencyIds
        }
      });
      
      console.log("Result:", JSON.stringify(result, null, 2));
      process.exit(0);
    } catch (error) {
      console.debug("Error:", error);
      process.exit(1);
    }
  });

// Command to remove dependencies from a task
program
  .command("remove-dependencies")
  .description("Remove dependencies from a task in Asana (REQUIRES PREMIUM ASANA ACCOUNT)")
  .requiredOption("--task-id <taskId>", "ID of the task to remove dependencies from")
  .requiredOption("--dependency-ids <dependencyIds>", "Comma-separated list of task IDs to remove as dependencies")
  .action(async (options: DependencyOptions) => {
    try {
      const client = await createClient();
      
      // Parse the comma-separated list of dependency IDs
      const dependencyIds = options.dependencyIds?.split(',') || [];
      
      console.log("Removing dependencies from task...");
      const result = await client.callTool({
        name: "remove-dependencies",
        arguments: {
          taskId: options.taskId,
          dependencyIds
        }
      });
      
      console.log("Result:", JSON.stringify(result, null, 2));
      process.exit(0);
    } catch (error) {
      console.debug("Error:", error);
      process.exit(1);
    }
  });

// Command to get dependencies for a task
program
  .command("get-dependencies")
  .description("Get dependencies for a task in Asana (REQUIRES PREMIUM ASANA ACCOUNT)")
  .requiredOption("--task-id <taskId>", "ID of the task to get dependencies for")
  .action(async (options: DependencyOptions) => {
    try {
      const client = await createClient();
      
      console.log("Getting dependencies for task...");
      const result = await client.callTool({
        name: "get-dependencies",
        arguments: {
          taskId: options.taskId
        }
      });
      
      console.log("Result:", JSON.stringify(result, null, 2));
      process.exit(0);
    } catch (error) {
      console.debug("Error:", error);
      process.exit(1);
    }
  });

// Command to list tasks in a project
program
  .command("list-tasks")
  .description("List tasks in an Asana project")
  .requiredOption("--project-id <projectId>", "ID of the project to list tasks from")
  .action(async (options: ListTasksOptions) => {
    try {
      const client = await createClient();
      
      console.log("Listing tasks in project...");
      const result = await client.callTool({
        name: "list-tasks",
        arguments: {
          projectId: options.projectId
        }
      });
      
      console.log("Result:", JSON.stringify(result, null, 2));
      process.exit(0);
    } catch (error) {
      console.debug("Error:", error);
      process.exit(1);
    }
  });

// Parse command-line arguments
program.parse();
