#!/bin/bash

# Asana MCP Client Script

# Display help
function show_help {
  echo "Asana MCP Client"
  echo "Usage:"
  echo "  ./asana-client.sh create --name \"Task Name\" [--description \"Task Description\"] [--due-date \"2025-04-15\"] [--assignee \"John Doe\"] [--project \"Project Name\"]"
  echo "  ./asana-client.sh update --task-id \"123456\" [--name \"New Task Name\"] [--description \"New Description\"] [--due-date \"2025-04-20\"] [--assignee \"Jane Doe\"] [--completed true|false]"
  echo "  ./asana-client.sh delete --task-id \"123456\""
  echo ""
  echo "Commands:"
  echo "  create    Create a new Asana task"
  echo "  update    Update an existing Asana task"
  echo "  delete    Delete an Asana task"
  echo ""
  echo "For more information, run: ./asana-client.sh [command] --help"
}

# Check if no arguments provided
if [ $# -eq 0 ]; then
  show_help
  exit 1
fi

# Get the command
COMMAND=$1
shift

# Execute the appropriate command
case $COMMAND in
  create)
    node dist/client.js create-task "$@"
    ;;
  update)
    node dist/client.js update-task "$@"
    ;;
  delete)
    node dist/client.js delete-task "$@"
    ;;
  help)
    show_help
    ;;
  *)
    echo "Unknown command: $COMMAND"
    show_help
    exit 1
    ;;
esac
