import readline from "readline";
import { TaskManager } from "./taskManager";
import { StorageService } from "./storage";
import { sampleTasks } from "./sampleData";
import { formatTasks, countAllTasks, getCompletionPercentage } from "./utils";
import { TaskNotFoundError, TaskValidationError } from "./errors";
import { Priority } from "./types";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Prompts the user for input.
 */
function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

/**
 * Converts user input into a valid Priority value.
 */
function parsePriority(input: string): Priority {
  const normalized = input.trim().toLowerCase();

  if (normalized === "low") {
    return "Low";
  }
  if (normalized === "medium") {
    return "Medium";
  }
  if (normalized === "high") {
    return "High";
  }

  throw new TaskValidationError('Priority must be "Low", "Medium", or "High".');
}

/**
 * Handles known application errors.
 */
function handleError(error: unknown): void {
  if (error instanceof TaskValidationError || error instanceof TaskNotFoundError) {
    console.error(`Handled Error: ${error.message}`);
  } else {
    console.error("Unexpected error:", error);
  }
}

/**
 * Prints the interactive menu.
 */
function showMenu(): void {
  console.log("\n======================================");
  console.log(" Interactive TypeScript Task List ");
  console.log("======================================");
  console.log("1. Show all tasks");
  console.log("2. Add a root task");
  console.log("3. Add a subtask");
  console.log("4. Edit a task");
  console.log("5. Toggle task completion");
  console.log("6. Delete a task");
  console.log("7. Show statistics");
  console.log("8. Reset to sample tasks");
  console.log("9. Exit");
  console.log("======================================\n");
}

/**
 * Runs the interactive task list.
 */
async function main(): Promise<void> {
  const storage = new StorageService();
  let tasks = await storage.loadTasks();

  if (tasks.length === 0) {
    tasks = sampleTasks;
    await storage.saveTasks(tasks);
  }

  const manager = new TaskManager(tasks);
  let running = true;

  while (running) {
    showMenu();
    const choice = (await ask("Choose an option (1-9): ")).trim();

    try {
      switch (choice) {
        case "1": {
          console.log("\nCurrent Tasks:");
          const output = formatTasks(manager.getTasks());
          console.log(output || "No tasks available.\n");
          break;
        }

        case "2": {
          const title = await ask("Enter task title: ");
          const priorityInput = await ask("Enter priority (Low, Medium, High): ");
          const dueDate = await ask("Enter due date (YYYY-MM-DD) or leave blank: ");

          const priority = parsePriority(priorityInput);
          const newTask = manager.addTask(title, priority, dueDate.trim() || undefined);
          await storage.saveTasks(manager.getTasks());

          console.log(`Task added successfully. New task ID: ${newTask.id}`);
          break;
        }

        case "3": {
          const parentId = await ask("Enter parent task ID: ");
          const title = await ask("Enter subtask title: ");
          const priorityInput = await ask("Enter priority (Low, Medium, High): ");
          const dueDate = await ask("Enter due date (YYYY-MM-DD) or leave blank: ");

          const priority = parsePriority(priorityInput);
          const newSubtask = manager.addSubtask(
            parentId.trim(),
            title,
            priority,
            dueDate.trim() || undefined
          );

          await storage.saveTasks(manager.getTasks());
          console.log(`Subtask added successfully. New subtask ID: ${newSubtask.id}`);
          break;
        }

        case "4": {
          const taskId = await ask("Enter task ID to edit: ");
          const existing = manager.findTask(taskId.trim());

          if (!existing) {
            throw new TaskNotFoundError(taskId.trim());
          }

          console.log(`Current title: ${existing.title}`);
          console.log(`Current priority: ${existing.priority}`);
          console.log(`Current due date: ${existing.dueDate ?? "None"}`);

          const newTitle = await ask("Enter new title: ");
          const newPriorityInput = await ask("Enter new priority (Low, Medium, High): ");
          const newDueDate = await ask("Enter new due date (YYYY-MM-DD) or leave blank: ");

          const newPriority = parsePriority(newPriorityInput);

          manager.editTask(taskId.trim(), newTitle, newPriority, newDueDate.trim() || undefined);
          await storage.saveTasks(manager.getTasks());

          console.log("Task edited successfully.");
          break;
        }

        case "5": {
          const taskId = await ask("Enter task ID to toggle: ");
          manager.toggleComplete(taskId.trim());
          await storage.saveTasks(manager.getTasks());

          console.log("Task completion toggled successfully.");
          break;
        }

        case "6": {
          const taskId = await ask("Enter task ID to delete: ");
          manager.deleteTask(taskId.trim());
          await storage.saveTasks(manager.getTasks());

          console.log("Task deleted successfully.");
          break;
        }

        case "7": {
          console.log("\nTask Statistics:");
          console.log(`Root task count: ${manager.getTasks().length}`);
          console.log(`All tasks including subtasks: ${countAllTasks(manager.getTasks())}`);
          console.log(`Completed root tasks: ${manager.getCompletedTaskCount()}`);
          console.log(`Completion percentage: ${getCompletionPercentage(manager.getTasks())}%`);
          break;
        }

        case "8": {
          manager.setTasks(JSON.parse(JSON.stringify(sampleTasks)));
          await storage.saveTasks(manager.getTasks());
          console.log("Task list reset to sample data.");
          break;
        }

        case "9": {
          running = false;
          console.log("Exiting program. Goodbye.");
          break;
        }

        default: {
          console.log("Invalid option. Please choose a number from 1 to 9.");
          break;
        }
      }
    } catch (error) {
      handleError(error);
    }
  }

  rl.close();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  rl.close();
});