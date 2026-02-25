# Task Tracker CLI

A simple command-line task tracker that stores tasks in a JSON file.

## Installation

1. Clone this repository
2. Navigate to the project directory
3. Make the script executable (optional):
   ```bash
   chmod +x task-cli.js

# usage
# Add a new task
node task-cli.js add "Buy groceries"

# Update a task
node task-cli.js update 1 "Buy groceries and cook dinner"

# Delete a task
node task-cli.js delete 1

# Mark task status
node task-cli.js mark-in-progress 1
node task-cli.js mark-done 1

# List tasks
node task-cli.js list           # List all tasks
node task-cli.js list done       # List completed tasks
node task-cli.js list todo        # List pending tasks
node task-cli.js list in-progress # List tasks in progress

# Show help
node task-cli.js

# Project URL
https://roadmap.sh/projects/task-tracker
