#!/bin/bash

# Test script for MCP Asana server

# Create a task
echo '{"type":"invoke","id":"1","method":"create-task","params":{"name":"Implement Asana API integration","description":"Connect to the Asana API to make the tools functional","dueDate":"2025-04-01","assignee":"John Doe","project":"MCP Integration"}}' | node dist/server.js

# Update a task
echo '{"type":"invoke","id":"2","method":"update-task","params":{"taskId":"123456","name":"Implement Asana API integration (Updated)","description":"Connect to the Asana API to make the tools functional and add error handling","completed":false}}' | node dist/server.js

# Delete a task
echo '{"type":"invoke","id":"3","method":"delete-task","params":{"taskId":"123456"}}' | node dist/server.js
