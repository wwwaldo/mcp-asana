#!/bin/bash

# Simple Asana MCP Client Script

# Display help
function show_help {
  echo "Simple Asana MCP Client"
  echo "Usage:"
  echo "  ./simple-client.sh create-task \"Task Name\" \"Description\" \"Due Date\" \"Assignee\" \"Project\""
  echo "  ./simple-client.sh list-tasks [\"ProjectId\"]"
  echo "  ./simple-client.sh update-task \"TaskId\" \"New Name\" \"New Description\" \"New Due Date\" \"New Assignee\" \"true|false\""
  echo "  ./simple-client.sh delete-task \"TaskId\""
  echo "  ./simple-client.sh create-project \"Project Name\" [\"Notes\"] [\"Color\"] [\"true|false\"]"
  echo "  ./simple-client.sh list-projects [\"WorkspaceId\"]"
  echo "  ./simple-client.sh delete-project \"ProjectId\""
  echo ""
  echo "Commands:"
  echo "  create-task    Create a new Asana task"
  echo "  list-tasks     List all tasks in a project"
  echo "  update-task    Update an existing Asana task"
  echo "  delete-task    Delete an Asana task"
  echo "  create-project Create a new Asana project"
  echo "  list-projects  List all projects in a workspace"
  echo "  delete-project Delete an Asana project"
}

# Check if no arguments provided
if [ $# -lt 1 ]; then
  show_help
  exit 1
fi

# Execute the client
node dist/simple-client.js "$@"
