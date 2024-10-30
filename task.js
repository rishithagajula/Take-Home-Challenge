let taskListArray = [];
let project = {
    projectId: 1,
    title: "Project1",
    createdDate: new Date().toLocaleString(),
    todos: []
};
let currentFilter = "all"; // Track current filter
let editMode = false; // Track if we're editing a task
let editTaskId = null; // Store the task ID if editing

// Load project data from localStorage if available
if (localStorage.getItem("projectData")) {
    project = JSON.parse(localStorage.getItem("projectData"));
    taskListArray = project.todos;
}

// Save or Update task
function saveTask() {
    const taskName = document.getElementById("txtItem").value.trim();
    const taskDescription = document.getElementById("txtDescription").value.trim();
    if (taskName) {
        if (editMode && editTaskId !== null) {
            // Update existing task
            const taskIndex = taskListArray.findIndex(task => task.taskId === editTaskId);
            if (taskIndex !== -1) {
                taskListArray[taskIndex].taskName = taskName;
                taskListArray[taskIndex].taskDescription = taskDescription;
                taskListArray[taskIndex].updatedDate = new Date().toLocaleString();
            }
            editMode = false;
            editTaskId = null;
        } else {
            // Add new task
            const newTask = {
                taskId: Date.now(),
                taskName: taskName,
                taskDescription: taskDescription,
                status: "pending",
                createdDate: new Date().toLocaleString(),
                updatedDate: new Date().toLocaleString()
            };
            taskListArray.push(newTask);
        }
        updateProjectData();
        renderTaskList();
        document.getElementById("txtItem").value = ""; // Clear inputs after adding/updating task
        document.getElementById("txtDescription").value = "";
    } else {
        alert("Please enter a task name.");
    }
}

// Update project data in localStorage
function updateProjectData() {
    project.todos = taskListArray;
    localStorage.setItem("projectData", JSON.stringify(project));
}

// Render the list of tasks based on the current filter
function renderTaskList() {
    const taskListElement = document.getElementById("myTaskList");
    taskListElement.innerHTML = ""; // Clear previous list

    let completedCount = 0;
    taskListArray.forEach((task) => {
        // Apply filter
        if (currentFilter === "completed" && task.status !== "completed") return;
        if (currentFilter === "pending" && task.status !== "pending") return;

        const taskElement = document.createElement("li");
        taskElement.classList.add("task");

        const taskLabel = document.createElement("label");
        const taskCheckbox = document.createElement("input");
        taskCheckbox.type = "checkbox";
        taskCheckbox.checked = task.status === "completed";
        taskCheckbox.addEventListener("change", () => toggleTaskStatus(task.taskId));
        taskLabel.appendChild(taskCheckbox);

        const taskDescription = document.createElement("p");
        taskDescription.textContent = `${task.taskName} - ${task.taskDescription} (Added on: ${task.createdDate})`;
        taskLabel.appendChild(taskDescription);

        taskElement.appendChild(taskLabel);

        const settingsDiv = document.createElement("div");
        settingsDiv.classList.add("settings");

        const editIcon = document.createElement("i");
        editIcon.classList.add("fa", "fa-pencil-square");
        editIcon.addEventListener("click", () => editTask(task.taskId));
        settingsDiv.appendChild(editIcon);

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa", "fa-trash");
        deleteIcon.addEventListener("click", () => deleteTask(task.taskId));
        settingsDiv.appendChild(deleteIcon);

        taskElement.appendChild(settingsDiv);
        taskListElement.appendChild(taskElement);

        if (task.status === "completed") completedCount++;
    });

    // Update the summary
    document.getElementById("summary").textContent = `${completedCount} / ${taskListArray.length} tasks completed`;
}

// Delete a task
function deleteTask(taskId) {
    taskListArray = taskListArray.filter(task => task.taskId !== taskId);
    updateProjectData();
    renderTaskList();
}

// Edit a task
function editTask(taskId) {
    const task = taskListArray.find(task => task.taskId === taskId);
    if (task) {
        document.getElementById("txtItem").value = task.taskName;
        document.getElementById("txtDescription").value = task.taskDescription;
        editMode = true;
        editTaskId = taskId;
    }
}

// Toggle task status between pending and completed
function toggleTaskStatus(taskId) {
    const task = taskListArray.find(task => task.taskId === taskId);
    if (task) {
        task.status = task.status === "pending" ? "completed" : "pending";
        task.updatedDate = new Date().toLocaleString();
        updateProjectData();
        renderTaskList();
    }
}

// Clear all tasks
function removeAll() {
    taskListArray = [];
    updateProjectData();
    renderTaskList();
}

// Set filter and re-render list
function setFilter(filter) {
    currentFilter = filter;
    renderTaskList();

    // Update active filter style
    document.getElementById("all").classList.remove("active");
    document.getElementById("pending").classList.remove("active");
    document.getElementById("completed").classList.remove("active");
    document.getElementById(filter).classList.add("active");
}

// Initial render on page load
document.addEventListener("DOMContentLoaded", () => {
    renderTaskList();
    document.getElementById("all").addEventListener("click", () => setFilter("all"));
    document.getElementById("pending").addEventListener("click", () => setFilter("pending"));
    document.getElementById("completed").addEventListener("click", () => setFilter("completed"));
});
