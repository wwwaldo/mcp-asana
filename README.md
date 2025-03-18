# MCP Asana Integration Server

This is an MCP (Model Context Protocol) server that provides tools for managing Asana tasks and projects. The server exposes tools for creating, updating, listing, and deleting Asana tasks and projects.

## Features

- **Task Management**
  - Create new Asana tasks with name, description, due date, assignee, and project
  - List tasks in a project
  - Update existing Asana tasks (name, description, due date, assignee, completion status)
  - Delete Asana tasks

- **Project Management**
  - Create new Asana projects with name, notes, color, and visibility settings
  - List all projects in a workspace
  - Delete Asana projects

## Prerequisites

- Node.js (v14 or higher)
- An Asana account with API access
- Asana Personal Access Token

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd mcp-asana

# Install dependencies
npm install
```

## Configuration

The MCP Asana Integration uses environment variables for configuration.

### Setting up your environment

1. Copy the example environment file to create your own:

```bash
cp .env.example .env
```

2. Edit the `.env` file with your Asana credentials and preferences:

```
# Required: Your Asana Personal Access Token
ASANA_ACCESS_TOKEN=your_asana_personal_access_token

# Required for task operations: Default Project ID for tasks
ASANA_PROJECT_ID=1234567890

# Required for project operations: Default Workspace ID for projects
ASANA_WORKSPACE_ID=0987654321
```

> **Important**: Both `ASANA_PROJECT_ID` and `ASANA_WORKSPACE_ID` are required for full functionality. Without a project ID, task operations may fail. Without a workspace ID, project operations may fail.

### Finding your Asana IDs

The repository includes helper scripts to find your Asana IDs:

```bash
# List all workspaces
node listWorkspaces.js

# List all projects
node listAllProjects.js
```

Make sure to copy the IDs from these scripts into your `.env` file.

## Usage

### Build the project

```bash
npm run build
```

### Run the server

The server currently supports stdio transport:

```bash
npm start
```

### Development mode

For development with automatic reloading:

```bash
npm run dev
```

### Using the simple client

A simple command-line client is included to interact with the server:

```bash
# Create a new task
./simple-client.sh create-task "Task Name" "Task Description" "2025-04-01" "" "1209708771942231"

# List tasks in a project
./simple-client.sh list-tasks

# Update a task
./simple-client.sh update-task "1234567890" "Updated Task Name" "Updated Description" "2025-05-01" "" "true"

# Delete a task
./simple-client.sh delete-task "1234567890"

# Create a new project
./simple-client.sh create-project "Project Name" "Project Notes" "light-green" "true"

# List all projects
./simple-client.sh list-projects

# Delete a project
./simple-client.sh delete-project "1234567890"
```

## API

### Task Management Tools

#### create-task

Creates a new Asana task.

Parameters:
- `name` (string, required): The name of the task
- `description` (string, optional): The description of the task
- `dueDate` (string, optional): The due date of the task (ISO format)
- `assignee` (string, optional): The assignee of the task
- `project` (string, optional): The project ID to add the task to

#### list-tasks

Lists tasks in a project.

Parameters:
- `projectId` (string, optional): The ID of the project to list tasks from (uses default project if not specified)

#### update-task

Updates an existing Asana task.

Parameters:
- `taskId` (string, required): The ID of the task to update
- `name` (string, optional): The new name of the task
- `description` (string, optional): The new description of the task
- `dueDate` (string, optional): The new due date of the task (ISO format)
- `assignee` (string, optional): The new assignee of the task
- `completed` (boolean, optional): Whether the task is completed

#### delete-task

Deletes an Asana task.

Parameters:
- `taskId` (string, required): The ID of the task to delete

### Project Management Tools

#### create-project

Creates a new Asana project.

Parameters:
- `name` (string, required): The name of the project
- `notes` (string, optional): Notes about the project
- `color` (string, optional): Color for the project (e.g., "light-green", "dark-blue")
- `isPublic` (boolean, optional): Whether the project is public to the team

#### list-projects

Lists all projects in a workspace.

Parameters:
- `workspaceId` (string, optional): The ID of the workspace to list projects from (uses default workspace if not specified)

#### delete-project

Deletes an Asana project.

Parameters:
- `projectId` (string, required): The ID of the project to delete

## Integration with MCP

To integrate this server with MCP, add the following to your MCP configuration:

```json
{
  "asana": {
    "command": "node",
    "args": [
      "/path/to/mcp-asana/dist/server.js"
    ]
  }
}
```

## Project Structure

```
mcp-asana/
├── asana/              # Asana API integration
│   ├── config.js       # Configuration and shared utilities
│   ├── index.js        # Main entry point for the Asana API
│   ├── index.d.ts      # TypeScript declarations
│   ├── projects.js     # Project management functions
│   └── tasks.js        # Task management functions
├── src/
│   ├── server.ts       # MCP server implementation
│   └── simple-client.ts # Command-line client
├── dist/               # Compiled JavaScript files
├── simple-client.sh    # Shell script for the command-line client
├── listWorkspaces.js   # Utility to list all workspaces
├── listAllProjects.js  # Utility to list all projects
├── .env.example        # Example environment file
└── package.json        # Project dependencies
```

## Known Limitations

- The HTTP/SSE transport is not currently supported
- Limited error handling for API responses
- No pagination support for listing tasks or projects

## License

[MIT](LICENSE)
