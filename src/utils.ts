import { Task } from "./types";

/**
 * Recursively counts all tasks and subtasks.
 *
 * @param tasks The list of tasks to count.
 * @returns Total number of tasks including subtasks.
 */
export function countAllTasks(tasks: Task[]): number {
  let total = 0;

  for (const task of tasks) {
    total += 1;

    if (task.subtasks.length > 0) {
      total += countAllTasks(task.subtasks);
    }
  }

  return total;
}

/**
 * Recursively finds a task by id.
 *
 * @param tasks The list of tasks to search.
 * @param id The task id to find.
 * @returns The matching task or undefined.
 */
export function findTaskById(tasks: Task[], id: string): Task | undefined {
  for (const task of tasks) {
    if (task.id === id) {
      return task;
    }

    if (task.subtasks.length > 0) {
      const found = findTaskById(task.subtasks, id);
      if (found) {
        return found;
      }
    }
  }

  return undefined;
}

/**
 * Recursively deletes a task by id.
 *
 * @param tasks The list of tasks to modify.
 * @param id The id to delete.
 * @returns True if deleted, otherwise false.
 */
export function deleteTaskRecursive(tasks: Task[], id: string): boolean {
  const index = tasks.findIndex((task) => task.id === id);

  if (index !== -1) {
    tasks.splice(index, 1);
    return true;
  }

  for (const task of tasks) {
    if (task.subtasks.length > 0) {
      const deleted = deleteTaskRecursive(task.subtasks, id);
      if (deleted) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Recursively toggles a task by id.
 *
 * @param tasks The list of tasks to search.
 * @param id The id to toggle.
 * @returns True if the task was updated, otherwise false.
 */
export function toggleTaskRecursive(tasks: Task[], id: string): boolean {
  for (const task of tasks) {
    if (task.id === id) {
      task.completed = !task.completed;
      return true;
    }

    if (task.subtasks.length > 0) {
      const updated = toggleTaskRecursive(task.subtasks, id);
      if (updated) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Flattens all tasks and subtasks into a single list.
 *
 * @param tasks The nested task list.
 * @returns A flat array of all tasks.
 */
export function flattenTasks(tasks: Task[]): Task[] {
  const flat: Task[] = [];

  for (const task of tasks) {
    flat.push(task);

    if (task.subtasks.length > 0) {
      flat.push(...flattenTasks(task.subtasks));
    }
  }

  return flat;
}

/**
 * Calculates completion percentage for all tasks including subtasks.
 *
 * @param tasks The task list.
 * @returns Completion percentage from 0 to 100.
 */
export function getCompletionPercentage(tasks: Task[]): number {
  const flat = flattenTasks(tasks);

  if (flat.length === 0) {
    return 0;
  }

  const completedCount = flat.filter((task) => task.completed).length;
  return Math.round((completedCount / flat.length) * 100);
}

/**
 * Formats tasks for terminal display.
 *
 * @param tasks The task list.
 * @param indent Current indentation depth.
 * @returns A formatted string.
 */
export function formatTasks(tasks: Task[], indent = 0): string {
  let output = "";

  for (const task of tasks) {
    const prefix = " ".repeat(indent);
    const status = task.completed ? "[x]" : "[ ]";
    const dueText = task.dueDate ? ` | Due: ${task.dueDate}` : "";

    output += `${prefix}${status} ${task.title} (${task.priority}) | ID: ${task.id}${dueText}\n`;

    if (task.subtasks.length > 0) {
      output += formatTasks(task.subtasks, indent + 2);
    }
  }

  return output;
}