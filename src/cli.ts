import { TaskManager } from "./taskManager";
import { StorageService } from "./storage";
import { sampleTasks } from "./sampleData";
import {
  countAllTasks,
  formatTasks,
  getCompletionPercentage
} from "./utils";
import { TaskNotFoundError, TaskValidationError } from "./errors";

/**
 * Demo mode for the project.
 * This automatically demonstrates the required TypeScript features.
 */
async function main(): Promise<void> {
  console.log("======================================");
  console.log(" TypeScript Task List CLI Demo ");
  console.log("======================================\n");

  const storage = new StorageService();
  let tasks = await storage.loadTasks();

  if (tasks.length === 0) {
    console.log("No saved tasks found. Loading sample tasks...\n");
    tasks = sampleTasks;
    await storage.saveTasks(tasks);
  }

  const manager = new TaskManager(tasks);

  console.log("Current Tasks:");
  console.log(formatTasks(manager.getTasks()));

  console.log(`Root task count: ${manager.getTasks().length}`);
  console.log(`All tasks including subtasks: ${countAllTasks(manager.getTasks())}`);
  console.log(`Completed root tasks: ${manager.getCompletedTaskCount()}`);
  console.log(`Completion percentage: ${getCompletionPercentage(manager.getTasks())}%\n`);

  console.log("Adding a new task...\n");

  try {
    manager.addTask("Practice TypeScript classes", "High", "2026-03-15");
    manager.addSubtask("task-102", "Write requirement checklist section", "Medium");
  } catch (error) {
    handleError(error);
  }

  console.log("Updated Tasks:");
  console.log(formatTasks(manager.getTasks()));

  console.log("Editing a task...\n");

  try {
    manager.editTask("task-102", "Prepare final README.md", "High", "2026-03-16");
  } catch (error) {
    handleError(error);
  }

  console.log("Tasks After Edit:");
  console.log(formatTasks(manager.getTasks()));

  console.log("Toggling a task...\n");

  try {
    manager.toggleComplete("task-101-2");
    console.log('Task "task-101-2" toggled successfully.\n');
  } catch (error) {
    handleError(error);
  }

  console.log("Trying to add an invalid task...");
  try {
    manager.addTask("", "Low");
  } catch (error) {
    handleError(error);
  }

  console.log("\nTrying to edit a missing task...");
  try {
    manager.editTask("missing-id", "Ghost Task", "Low");
  } catch (error) {
    handleError(error);
  }

  console.log("\nTrying to delete a missing task...");
  try {
    manager.deleteTask("missing-id");
  } catch (error) {
    handleError(error);
  }

  await storage.saveTasks(manager.getTasks());

  console.log("\nFinal Tasks Saved Successfully.");
  console.log("Program complete.");
}

/**
 * Handles known errors gracefully.
 */
function handleError(error: unknown): void {
  if (error instanceof TaskValidationError || error instanceof TaskNotFoundError) {
    console.error(`Handled Error: ${error.message}`);
  } else {
    console.error("Unexpected error:", error);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
});