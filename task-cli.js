#!/usr/bin/env node



import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TASK_FILE = path.join(__dirname, "tasks.json");

function readTasks() {
    try {
        // check if file exist
        if (!fs.existsSync(TASK_FILE)) {
            fs.writeFileSync(TASK_FILE, JSON.stringify([]));
            return [];
        }

        // read and pasre data

        const data = fs.readFileSync(TASK_FILE, 'utf8');
        return JSON.parse(data)
        
    } catch (error) {
        console.error("Error reading task",error.message)
    }
    
}

// function to write task to file
function writeTasks(tasks) {
    
    try {
        fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
        return true;
    } catch (error) {
        console.error('Error writting tasks:', error.message);
        return false
    }
}


const args = process.argv.slice(2);
const command = args[0];

// handle the add command
if (command === "add") {
  const taskDescription = args[1]; // get the task description from the command line arguments

    // check if task description is provided
  if (!taskDescription) {
    console.log("Error: please provide a task description");
    // immediately terminate the program
    process.exit(1);
    // process.exitCode = 1;
  }

  // Read existing tasks
  const tasks = readTasks();

  // generate a new id for the task
  const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

  // cretaing a new task object
  const newTask = {
    id: newId,
    description: taskDescription,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

    tasks.push(newTask);
    
  // write the updated task list back to the file
  if (writeTasks(tasks)) {
    console.log(`Task added successfully: ${taskDescription}`);
  }
} else if (command === "update") {
  const taskId = parseInt(args[1]);
  const newDescription = args[2];// get the new description from the command line arguments

    // check if task id and new description are provided
  if (!taskId || !newDescription) {
    console.log("Error: please provide task id and a new description");
    process.exit(1);
  }
// read existing tasks
    const tasks = readTasks();
    // find the task with the given id
  const task = tasks.find((t) => t.id === taskId);

    
    // check if task with the given id exists
  if (!task) {
    console.log(`Error: task with id ${taskId} not found`);
    process.exit(1);
  }

  task.description = newDescription;
  task.updatedAt = new Date().toISOString();

    // write the updated task list back to the file
  if (writeTasks(tasks)) {
    console.log(`Task with id ${taskId} updated successfully`);
    }
    

} else if (command === "delete") {
    const taskId = parseInt(args[1]);
    
// check if task id is provided
  if (!taskId) {
    console.log("Error: please provide a task id to delete");
    process.exit(1);
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    console.log(`Error: task with id ${taskId} not found`);
    process.exit(1);
  }

  tasks.splice(taskIndex, 1);

  if (writeTasks(tasks)) {
    console.log(`Task with id ${taskId} deleted successfully`);
  }
} else if (command === "mark-in-progress") {
  const taskId = parseInt(args[1]);

  if (!taskId) {
    console.log("Error: please provide a task id to mark as in progress");
    process.exit(1);
  }
    const tasks = readTasks();
    // find the task with the given id
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    console.log(`Error: task with id ${taskId} not found`);
    process.exit(1);
  }
  task.status = "in-progress";
  task.updatedAt = new Date().toISOString();

  if (writeTasks(tasks)) {
    console.log(`Task with id ${taskId} marked as in-progress successfully`);
  }
} else if (command === "mark-done") {
  const taskId = parseInt(args[1]);

  if (!taskId) {
    console.log("Error: please provide a task id to mark as done");
    process.exit(1);
    }
    
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    console.log(`Error: task with id ${taskId} not found`);
    process.exit(1);
  }

  task.status = "done";
  task.updatedAt = new Date().toISOString();

    if (writeTasks(tasks)) {
        console.log(`Task with id ${taskId} marked as done successfully`);
    }

} else if (command === "list") {
  const tasks = readTasks();
  const filter = args[1];

  if (tasks.length === 0) {
    console.log("No tasks found.");
    process.exit(0);
  }

  let filteredTasks = tasks;
  let statusFilter = "";

  if (filter === "done") {
    filteredTasks = tasks.filter((t) => t.status === "done");
    statusFilter = "done";
  } else if (filter === "todo") {
    filteredTasks = tasks.filter((t) => t.status === "todo");
    statusFilter = "todo";
  } else if (filter === "in-progress") {
    filteredTasks = tasks.filter((t) => t.status === "in-progress");
    statusFilter = "in-progress";
  } else if (filter) {
    console.log(
      `Error: Invalid filter "${filter}". Use: done, todo, or in-progress`,
    );
    process.exit(1);
    }
   
    // check if filter is provided but invalid
  if (filteredTasks.length === 0) {
    console.log(`No tasks found${statusFilter}`);
  } else {
    console.log(`\nYour tasks ${statusFilter}:`);
    filteredTasks.forEach((task) => {
      let statusIcon = "📝"; // todo
      if (task.status === "in-progress") statusIcon = "🔄";
      if (task.status === "done") statusIcon = "✅";

      console.log(`${statusIcon} [${task.id}] ${task.description}`);
      console.log(`   Created: ${new Date(task.createdAt).toLocaleString()}`);
      console.log(`   Updated: ${new Date(task.updatedAt).toLocaleString()}`);
      console.log("---");
    });
  }


} else {
  console.log(`
            ╔══════════════════════════════════════╗
            ║     Task Tracker CLI - Help Menu     ║
            ╚══════════════════════════════════════╝
            
            Usage: node task-cli.js <command> [arguments]
            
            Commands:
              add "description"           Add a new task
              update <id> "description"   Update a task's description
              delete <id>                 Delete a task
              
              mark-in-progress <id>       Mark a task as in progress
              mark-done <id>              Mark a task as done
              
              list                        List all tasks
              list done                   List completed tasks
              list todo                   List pending tasks
              list in-progress            List tasks in progress
            
            Examples:
              node task-cli.js add "Buy groceries"
              node task-cli.js list
              node task-cli.js mark-done 1
                `);
}





// # Add tasks
// node task-cli.js add "Buy groceries"
// node task-cli.js add "Walk the dog"
// node task-cli.js add "Finish project"

// # List all tasks
// node task-cli.js list

// # Update a task
// node task-cli.js update 2 "Walk the dog in the park"

// # Mark tasks
// node task-cli.js mark-in-progress 1
// node task-cli.js mark-done 3

// # List filtered tasks
// node task-cli.js list todo
// node task-cli.js list in-progress
// node task-cli.js list done

// # Delete a task
// node task-cli.js delete 2

// # Check help
// node task-cli.js

// node task-cli add Buy groceries


