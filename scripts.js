/**
 * Import starting task data
 */
import { initialTasks } from './initialData.js';

/**
 * Create a single task element for the board
 * @param {Object} task - Task data
 * @param {string} task.id - Task ID
 * @param {string} task.title - Task title
 * @param {string} task.description - Task description
 * @param {string} task.status - Task status (e.g. "todo", "done")
 * @returns {HTMLDivElement} The created task element
 */
function createTaskElement(task) {
  const taskDivElement = document.createElement('div');
  taskDivElement.className = 'task-div';
  taskDivElement.textContent = task.title;
  taskDivElement.dataset.id = task.id;
  taskDivElement.addEventListener('click', () => openTaskModal(task));
  return taskDivElement;
}

/**
 * Find the task container for a given status
 * @param {string} status - The status to look for
 * @returns {HTMLElement|null} The container element
 */
function getTasksContainerByStatus(status) {
  const column = document.querySelector(`.column-div[data-status="${status}"]`);
  return column ? column.querySelector('.tasks-container') : null;
}

/**
 * Remove all existing tasks from the board
 */
function clearExistingTasks() {
  document.querySelectorAll('.tasks-container').forEach(container => {
    container.innerHTML = '';
  });
}

/**
 * Show all tasks on the board
 * @param {Object[]} tasks - Array of task objects
 */
function renderTasks(tasks) {
  tasks.forEach(task => {
    const tasksContainer = getTasksContainerByStatus(task.status);
    if (tasksContainer) {
      tasksContainer.appendChild(createTaskElement(task));
    }
  });
}

/**
 * Open the modal and fill in task info
 * @param {Object} task - The selected task
 */
function openTaskModal(task) {
  const modal = document.getElementById('task-modal');
  document.getElementById('task-title').value = task.title;
  document.getElementById('task-desc').value = task.description;
  document.getElementById('task-status').value = task.status;
  modal.showModal();
}

/**
 * Set up the modal close button
 */
function setupModalClose() {
  const modal = document.getElementById('task-modal');
  const closeBtn = document.getElementById('close-modal-btn');

  closeBtn.addEventListener('click', () => {
    modal.close();
  });
}

/**
 * Load the starting tasks
 */
function initialTasksList() {
  clearExistingTasks();
  renderTasks(initialTasks);
}

/**
 * Run everything after the page loads
 */
document.addEventListener('DOMContentLoaded', () => {
  initialTasksList();
  setupModalClose();
});