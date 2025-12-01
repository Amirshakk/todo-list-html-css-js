// Selecting DOM elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// ========== LocalStorage Functions ==========

// Save tasks array to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-item").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").textContent,
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];

    saved.forEach(task => {
        createTask(task.text, task.completed);
    });
}

// ========== Create Task Function ==========

function createTask(text, completed = false) {
    const li = document.createElement("li");
    li.className = "task-item";
    if (completed) li.classList.add("completed");

    li.innerHTML = `
        <span class="task-text">${text}</span>
        <button class="delete-btn">Delete</button>
    `;

    taskList.appendChild(li);
}

// ========== Add New Task ==========

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    createTask(text);
    saveTasks();

    taskInput.value = "";
}

// ========== Click Events (Delete + Complete) ==========

taskList.addEventListener("click", function (e) {

    // Delete button
    if (e.target.classList.contains("delete-btn")) {
        const li = e.target.parentElement;

        li.classList.add("fade-out");
        setTimeout(() => {
            li.remove();
            saveTasks();
        }, 250);
    }

    // Toggle completed
    if (e.target.classList.contains("task-text")) {
        e.target.parentElement.classList.toggle("completed");
        saveTasks();
    }
});

// ========== Add Button Event ==========
addBtn.addEventListener("click", addTask);

// Load tasks on page load
loadTasks();

// ========== Add Task on ENTER Key ==========
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// ========== Extra Validation: Block empty or repeated spaces ==========
function isValidTask(text) {
    // Reject empty string or strings like "     "
    if (text.trim().length === 0) return false;

    // Reject tasks with more than 3 repeated spaces
    if (/ {3,}/.test(text)) return false;

    return true;
}

// Override addTask with validation
function addTask() {
    const text = taskInput.value;

    if (!isValidTask(text)) {
        taskInput.classList.add("error");
        setTimeout(() => taskInput.classList.remove("error"), 400);
        return;
    }

    createTask(text.trim());
    saveTasks();

    taskInput.value = "";
}
