/**
 * Error thrown when task input is invalid.
 */
export class TaskValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "TaskValidationError";
    }
}
  
  /**
   * Error thrown when a task cannot be found.
   */
  export class TaskNotFoundError extends Error {
    constructor(taskId: string) {
      super(`Task with id "${taskId}" was not found.`);
      this.name = "TaskNotFoundError";
    }
}