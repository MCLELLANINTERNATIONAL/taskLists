import dayjs from "dayjs";
import { Task, TaskFilter, Priority } from "./types";
import { TaskNotFoundError, TaskValidationError } from "./errors";
import {
  deleteTaskRecursive,
  findTaskById,
  toggleTaskRecursive
} from "./utils";

/**
 * Manages task creation, editing, filtering, and deletion.
 */
export class TaskManager {
  private tasks: Task[];

  constructor(initialTasks: Task[] = []) {
    this.tasks = initialTasks;
  }

  /**
   * Returns all tasks.
   */
  public getTasks(): Task[] {
    return this.tasks;
  }

  /**
   * Replaces the current tasks.
   */
  public setTasks(tasks: Task[]): void {
    this.tasks = tasks;
  }

  /**
   * Adds a root task.
   */
  public addTask(title: string, priority: Priority, dueDate?: string): Task {
    this.validateTitle(title);
    this.validateDueDate(dueDate);

    const task: Task = {
      id: this.generateId(),
      title: title.trim(),
      completed: false,
      priority,
      dueDate,
      subtasks: []
    };

    this.tasks.push(task);
    return task;
  }

  /**
   * Adds a subtask to an existing task.
   */
  public addSubtask(parentId: string, title: string, priority: Priority, dueDate?: string): Task {
    this.validateTitle(title);
    this.validateDueDate(dueDate);

    const parent = findTaskById(this.tasks, parentId);
    if (!parent) {
      throw new TaskNotFoundError(parentId);
    }

    const subtask: Task = {
      id: this.generateId(),
      title: title.trim(),
      completed: false,
      priority,
      dueDate,
      subtasks: []
    };

    parent.subtasks.push(subtask);
    return subtask;
  }

  /**
   * Edits an existing task.
   */
  public editTask(taskId: string, newTitle: string, newPriority: Priority, newDueDate?: string): void {
    this.validateTitle(newTitle);
    this.validateDueDate(newDueDate);

    const task = findTaskById(this.tasks, taskId);
    if (!task) {
      throw new TaskNotFoundError(taskId);
    }

    task.title = newTitle.trim();
    task.priority = newPriority;
    task.dueDate = newDueDate;
  }

  /**
   * Toggles task completion.
   */
  public toggleComplete(taskId: string): void {
    const updated = toggleTaskRecursive(this.tasks, taskId);

    if (!updated) {
      throw new TaskNotFoundError(taskId);
    }
  }

  /**
   * Deletes a task or subtask.
   */
  public deleteTask(taskId: string): void {
    const deleted = deleteTaskRecursive(this.tasks, taskId);

    if (!deleted) {
      throw new TaskNotFoundError(taskId);
    }
  }

  /**
   * Filters root tasks.
   */
  public filterTasks(filter: TaskFilter): Task[] {
    switch (filter) {
      case "Active":
        return this.tasks.filter((task) => !task.completed);
      case "Completed":
        return this.tasks.filter((task) => task.completed);
      case "All":
      default:
        return [...this.tasks];
    }
  }

  /**
   * Finds a task by id.
   */
  public findTask(taskId: string): Task | undefined {
    return findTaskById(this.tasks, taskId);
  }

  /**
   * Returns completed root task count.
   */
  public getCompletedTaskCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }

  /**
   * Validates a task title.
   */
  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new TaskValidationError("Task title cannot be empty.");
    }
  }

  /**
   * Validates due date format if provided using dayjs.
   */
  private validateDueDate(dueDate?: string): void {
    if (!dueDate) {
      return;
    }

    const parsed = dayjs(dueDate, "YYYY-MM-DD", true);

    if (!parsed.isValid()) {
      throw new TaskValidationError('Due date must be a valid date in the format "YYYY-MM-DD".');
    }
  }

  /**
   * Generates a simple unique task id.
   */
  private generateId(): string {
    return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}