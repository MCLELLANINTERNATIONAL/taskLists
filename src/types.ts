/**
 * Represents the allowed priority values for a task.
 */
export type Priority = "Low" | "Medium" | "High";

/**
 * Represents the available task filters.
 */
export type TaskFilter = "All" | "Active" | "Completed";

/**
 * Represents a task in the application.
 * A task can contain nested subtasks, which supports recursion.
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  subtasks: Task[];
}