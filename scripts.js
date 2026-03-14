/**
 * @fileoverview JSL04 — Dynamic Kanban Task Board
 * Renders tasks from initialData.js into the correct board columns
 * and provides a modal for viewing and editing task details.
 */

// ─── State ────────────────────────────────────────────────────────────────────

/** @type {number|null} ID of the task currently open in the modal */
let activeTaskId = null;

// ─── DOM References ───────────────────────────────────────────────────────────

const columnContainers = {
  todo:  document.getElementById("todo-tasks"),
  doing: document.getElementById("doing-tasks"),
  done:  document.getElementById("done-tasks"),
};

const columnHeaders = {
  todo:  document.getElementById("todo-header"),
  doing: document.getElementById("doing-header"),
  done:  document.getElementById("done-header"),
};

const backdrop       = document.getElementById("modal-backdrop");
const modalTitle     = document.getElementById("modal-task-title");
const modalDesc      = document.getElementById("modal-task-desc");
const modalStatus    = document.getElementById("modal-task-status");
const modalSaveBtn   = document.getElementById("modal-save-btn");
const modalCloseBtn  = document.getElementById("modal-close-btn");

// ─── Column label map ─────────────────────────────────────────────────────────

const COLUMN_LABELS = {
  todo:  "TODO",
  doing: "DOING",
  done:  "DONE",
};

// ─── Core Functions ───────────────────────────────────────────────────────────

/**
 * Creates a task card DOM element for a given task.
 *
 * @param {{ id: number, title: string, description: string, status: string }} task
 * @returns {HTMLDivElement} The task card element
 */
function createTaskElement(task) {
  const card = document.createElement("div");
  card.classList.add("task-div");
  card.textContent = task.title;
  card.dataset.taskId = task.id;
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `Open task: ${task.title}`);

  card.addEventListener("click", () => openModal(task.id));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openModal(task.id);
  });

  return card;
}

/**
 * Renders all tasks from initialTasks into their respective board columns
 * and updates each column's count in the header.
 *
 * @returns {void}
 */
function renderTasks() {
  // Clear existing cards
  Object.values(columnContainers).forEach((container) => (container.innerHTML = ""));

  const counts = { todo: 0, doing: 0, done: 0 };

  initialTasks.forEach((task) => {
    const status = task.status;
    if (!columnContainers[status]) return; // skip unknown statuses

    const card = createTaskElement(task);
    columnContainers[status].appendChild(card);
    counts[status]++;
  });

  // Update column header counts
  Object.keys(counts).forEach((status) => {
    columnHeaders[status].textContent = `${COLUMN_LABELS[status]} (${counts[status]})`;
  });
}

// ─── Modal Functions ──────────────────────────────────────────────────────────

/**
 * Finds a task by its ID from the initialTasks array.
 *
 * @param {number} id - The task ID to look up
 * @returns {{ id: number, title: string, description: string, status: string }|undefined}
 */
function getTaskById(id) {
  return initialTasks.find((task) => task.id === id);
}

/**
 * Opens the task detail modal and populates it with the given task's data.
 *
 * @param {number} taskId - The ID of the task to display
 * @returns {void}
 */
function openModal(taskId) {
  const task = getTaskById(taskId);
  if (!task) return;

  activeTaskId = taskId;

  modalTitle.value       = task.title;
  modalDesc.value        = task.description;
  modalStatus.value      = task.status;

  backdrop.removeAttribute("hidden");
  modalTitle.focus();
}

/**
 * Closes the task detail modal and clears the active task reference.
 *
 * @returns {void}
 */
function closeModal() {
  backdrop.setAttribute("hidden", "");
  activeTaskId = null;
}

/**
 * Saves the edited task data from the modal back into initialTasks,
 * then re-renders the board and closes the modal.
 *
 * @returns {void}
 */
function saveTaskChanges() {
  if (activeTaskId === null) return;

  const task = getTaskById(activeTaskId);
  if (!task) return;

  task.title       = modalTitle.value.trim() || task.title;
  task.description = modalDesc.value.trim();
  task.status      = modalStatus.value;

  renderTasks();
  closeModal();
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

modalCloseBtn.addEventListener("click", closeModal);
modalSaveBtn.addEventListener("click", saveTaskChanges);

// Close modal when clicking the backdrop (outside the modal box)
backdrop.addEventListener("click", (e) => {
  if (e.target === backdrop) closeModal();
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !backdrop.hasAttribute("hidden")) closeModal();
});

// ─── Init ─────────────────────────────────────────────────────────────────────

renderTasks();
