# MCP Asana Tasks Server

This is an MCP (Model Context Protocol) server that provides tools for managing Asana tasks. The server exposes tools for creating, updating, and deleting Asana tasks.

## Features

- Create new Asana tasks with name, description, due date, assignee, and project
- Update existing Asana tasks (name, description, due date, assignee, completion status)
- Delete Asana tasks

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd mcp-asana

# Install dependencies
npm install
```

## Usage

### Build the project

```bash
npm run build
```

### Run the server

The server currently only supports stdio transport:

```bash
npm start
```

### Development mode

For development with automatic reloading:

```bash
npm run dev
```

## API

### Tools

#### create-task

Creates a new Asana task.

Parameters:
- `name` (string, required): The name of the task
- `description` (string, optional): The description of the task
- `dueDate` (string, optional): The due date of the task (ISO format)
- `assignee` (string, optional): The assignee of the task
- `project` (string, optional): The project to add the task to

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

## Note

This is currently a stub implementation that logs actions to the console. To make it fully functional, you would need to integrate with the Asana API using their official SDK or REST API.

## Known Limitations

The HTTP/SSE transport is not currently supported due to compatibility issues with the SSEServerTransport class. Future versions may add support for HTTP transport.
