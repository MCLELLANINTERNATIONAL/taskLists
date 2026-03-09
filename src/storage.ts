import { promises as fs } from "fs";
import path from "path";
import { Task } from "./types";

/**
 * Handles async loading and saving of tasks.
 */
export class StorageService {
  private filePath: string;

  constructor(fileName = "tasks.json") {
    this.filePath = path.join(process.cwd(), "data", fileName);
  }

  /**
   * Loads tasks from JSON.
   * Returns an empty array if the file does not exist or cannot be read.
   */
  public async loadTasks(): Promise<Task[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data) as Task[];
    } catch {
      return [];
    }
  }

  /**
   * Saves tasks to JSON.
   */
  public async saveTasks(tasks: Task[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(tasks, null, 2), "utf-8");
  }
}