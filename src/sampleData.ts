import { Task } from "./types";

/**
 * Starter data used if no saved task file exists yet.
 */
export const sampleTasks: Task[] = [
  {
    id: "task-101",
    title: "Complete TypeScript module project",
    completed: false,
    priority: "High",
    dueDate: "2026-03-14",
    subtasks: [
      {
        id: "task-101-1",
        title: "Create TaskManager class",
        completed: true,
        priority: "High",
        subtasks: []
      },
      {
        id: "task-101-2",
        title: "Implement recursive functions",
        completed: false,
        priority: "Medium",
        subtasks: []
      }
    ]
  },
  {
    id: "task-102",
    title: "Prepare README.md",
    completed: false,
    priority: "Medium",
    dueDate: "2026-03-13",
    subtasks: []
  },
  {
    id: "task-103",
    title: "Test terminal output",
    completed: true,
    priority: "Low",
    subtasks: []
  }
];