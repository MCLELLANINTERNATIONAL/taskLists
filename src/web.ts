import dayjs from "dayjs";
import { TaskManager } from "./taskManager";
import { Task, Priority, TaskFilter } from "./types";
import { countAllTasks, getCompletionPercentage } from "./utils";
import { TaskNotFoundError, TaskValidationError } from "./errors";
import { sampleTasks } from "./sampleData";
import "./styles.css";

/**
 * Browser-based storage wrapper using localStorage.
 */
class BrowserStorageService {
  private storageKey = "ts-task-list-browser";

  public async loadTasks(): Promise<Task[]> {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  }

  public async saveTasks(tasks: Task[]): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }
}

/**
 * Creates a deep copy so the browser version can safely use starter data.
 */
function cloneSampleTasks(): Task[] {
  return JSON.parse(JSON.stringify(sampleTasks)) as Task[];
}

const storage = new BrowserStorageService();
const manager = new TaskManager();

const titleInput = document.getElementById("title") as HTMLInputElement;
const prioritySelect = document.getElementById("priority") as HTMLSelectElement;
const dueDateInput = document.getElementById("dueDate") as HTMLInputElement;
const addButton = document.getElementById("add-btn") as HTMLButtonElement;
const taskListEl = document.getElementById("task-list") as HTMLUListElement;
const messageEl = document.getElementById("message") as HTMLParagraphElement;
const totalEl = document.getElementById("total-count") as HTMLSpanElement;
const completeEl = document.getElementById("complete-count") as HTMLSpanElement;
const allCountEl = document.getElementById("all-count") as HTMLSpanElement;
const percentEl = document.getElementById("percent") as HTMLSpanElement;
const filterButtons = document.querySelectorAll("[data-filter]");
const resetButton = document.getElementById("reset-btn") as HTMLButtonElement;

let currentFilter: TaskFilter = "All";

/**
 * Initializes the browser app.
 */
async function init(): Promise<void> {
  const savedTasks = await storage.loadTasks();

  if (savedTasks.length > 0) {
    manager.setTasks(savedTasks);
  } else {
    const starterTasks = cloneSampleTasks();
    manager.setTasks(starterTasks);
    await storage.saveTasks(starterTasks);
  }

  attachEvents();
  renderTasks(manager.filterTasks(currentFilter));
}

/**
 * Attaches UI events.
 */
function attachEvents(): void {
  addButton.addEventListener("click", async () => {
    clearMessage();

    try {
      manager.addTask(
        titleInput.value,
        prioritySelect.value as Priority,
        dueDateInput.value || undefined
      );

      await storage.saveTasks(manager.getTasks());
      renderTasks(manager.filterTasks(currentFilter));

      titleInput.value = "";
      dueDateInput.value = "";
      prioritySelect.value = "Medium";
      showMessage("Task added successfully.", false);
    } catch (error) {
      handleWebError(error);
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.getAttribute("data-filter") as TaskFilter;
      renderTasks(manager.filterTasks(currentFilter));
    });
  });

  resetButton.addEventListener("click", async () => {
    const starterTasks = cloneSampleTasks();
    manager.setTasks(starterTasks);
    await storage.saveTasks(manager.getTasks());
    renderTasks(manager.filterTasks(currentFilter));
    showMessage("Browser task list reset to sample tasks.", false);
  });
}

/**
 * Renders tasks.
 */
function renderTasks(tasks: Task[]): void {
  taskListEl.innerHTML = "";

  if (tasks.length === 0) {
    taskListEl.innerHTML = `<li class="empty">No tasks to display.</li>`;
  } else {
    tasks.forEach((task) => {
      taskListEl.appendChild(createTaskElement(task));
    });
  }

  updateStats();
}

/**
 * Creates a task list item.
 */
function createTaskElement(task: Task): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "task-item";

  const wrapper = document.createElement("div");
  wrapper.className = "task-main";

  const left = document.createElement("div");
  left.className = "task-left";

  const dueText = task.dueDate ? ` | Due: ${dayjs(task.dueDate).format("YYYY-MM-DD")}` : "";
  const title = document.createElement("span");
  title.textContent = `${task.completed ? "✔" : "○"} ${task.title} [${task.priority}] | ID: ${task.id}${dueText}`;

  if (task.completed) {
    title.classList.add("completed");
  }

  left.appendChild(title);

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.textContent = "Toggle";
  toggleBtn.addEventListener("click", async () => {
    try {
      manager.toggleComplete(task.id);
      await storage.saveTasks(manager.getTasks());
      renderTasks(manager.filterTasks(currentFilter));
    } catch (error) {
      handleWebError(error);
    }
  });

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", async () => {
    try {
      const newTitle = prompt("Enter new task title:", task.title);
      if (newTitle === null) return;

      const newPriority = prompt("Enter new priority (Low, Medium, High):", task.priority);
      if (newPriority === null) return;

      const newDueDate = prompt(
        'Enter new due date (YYYY-MM-DD) or leave blank:',
        task.dueDate ?? ""
      );
      if (newDueDate === null) return;

      manager.editTask(
        task.id,
        newTitle,
        normalizePriority(newPriority),
        newDueDate.trim() || undefined
      );

      await storage.saveTasks(manager.getTasks());
      renderTasks(manager.filterTasks(currentFilter));
      showMessage("Task edited successfully.", false);
    } catch (error) {
      handleWebError(error);
    }
  });

  const addSubtaskBtn = document.createElement("button");
  addSubtaskBtn.type = "button";
  addSubtaskBtn.textContent = "Add Subtask";
  addSubtaskBtn.addEventListener("click", async () => {
    try {
      const title = prompt("Enter subtask title:");
      if (!title) return;

      const priorityInput = prompt("Enter priority (Low, Medium, High):", "Medium");
      if (!priorityInput) return;

      const dueDate = prompt('Enter due date (YYYY-MM-DD) or leave blank:', "");
      if (dueDate === null) return;

      manager.addSubtask(task.id, title, normalizePriority(priorityInput), dueDate.trim() || undefined);

      await storage.saveTasks(manager.getTasks());
      renderTasks(manager.filterTasks(currentFilter));
      showMessage("Subtask added successfully.", false);
    } catch (error) {
      handleWebError(error);
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", async () => {
    try {
      manager.deleteTask(task.id);
      await storage.saveTasks(manager.getTasks());
      renderTasks(manager.filterTasks(currentFilter));
      showMessage("Task deleted successfully.", false);
    } catch (error) {
      handleWebError(error);
    }
  });

  buttonGroup.appendChild(toggleBtn);
  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(addSubtaskBtn);
  buttonGroup.appendChild(deleteBtn);

  wrapper.appendChild(left);
  wrapper.appendChild(buttonGroup);
  li.appendChild(wrapper);

  if (task.subtasks.length > 0) {
    const subList = document.createElement("ul");
    subList.className = "subtasks";

    task.subtasks.forEach((subtask) => {
      subList.appendChild(createTaskElement(subtask));
    });

    li.appendChild(subList);
  }

  return li;
}

/**
 * Updates statistics.
 */
function updateStats(): void {
  totalEl.textContent = manager.getTasks().length.toString();
  completeEl.textContent = manager.getCompletedTaskCount().toString();
  allCountEl.textContent = countAllTasks(manager.getTasks()).toString();
  percentEl.textContent = `${getCompletionPercentage(manager.getTasks())}%`;
}

/**
 * Displays a message.
 */
function showMessage(message: string, isError: boolean): void {
  messageEl.textContent = message;
  messageEl.className = isError ? "message error" : "message success";
}

/**
 * Clears any message.
 */
function clearMessage(): void {
  messageEl.textContent = "";
  messageEl.className = "message";
}

/**
 * Converts prompt input to a valid priority.
 */
function normalizePriority(input: string): Priority {
  const value = input.trim().toLowerCase();

  if (value === "low") return "Low";
  if (value === "medium") return "Medium";
  if (value === "high") return "High";

  throw new TaskValidationError('Priority must be "Low", "Medium", or "High".');
}

/**
 * Handles browser errors.
 */
function handleWebError(error: unknown): void {
  if (error instanceof TaskValidationError || error instanceof TaskNotFoundError) {
    showMessage(error.message, true);
  } else {
    showMessage("An unexpected error occurred.", true);
    console.error(error);
  }
}

init().catch((error) => {
  console.error("Initialization error:", error);
});