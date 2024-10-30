let taskListArray = [];
let project = {
    projectId: 1,
    title: "Project1",
    createdDate: new Date().toLocaleString(),
    todos: []
};
let currentFilter = "all";
let editMode = false;
let editTaskId = null;

if (localStorage.getItem("projectData")) {
    project = JSON.parse(localStorage.getItem("projectData"));
    taskListArray = project.todos;
}

function saveTask() {
    const taskName = document.getElementById("txtItem").value.trim();
    const taskDescription = document.getElementById("txtDescription").value.trim();

    if (taskName) {
        if (editMode && editTaskId !== null) {
            const taskIndex = taskListArray.findIndex(task => task.taskId === editTaskId);
            if (taskIndex !== -1) {
                taskListArray[taskIndex].taskName = taskName;
                taskListArray[taskIndex].taskDescription = taskDescription;
                taskListArray[taskIndex].updatedDate = new Date().toLocaleString();
            }
            editMode = false;
            editTaskId = null;
        } else {
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
        document.getElementById("txtItem").value = "";
        document.getElementById("txtDescription").value = "";
    } else {
        alert("Please enter a task name.");
    }
}

function updateProjectData() {
    project.todos = taskListArray;
    localStorage.setItem("projectData", JSON.stringify(project));
}

function renderTaskList() {
    const taskListElement = document.getElementById("myTaskList");
    taskListElement.innerHTML = "";

    let completedCount = 0;
    taskListArray.forEach((task) => {
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

    document.getElementById("summary").textContent = `${completedCount} / ${taskListArray.length} tasks completed`;
}

function deleteTask(taskId) {
    taskListArray = taskListArray.filter(task => task.taskId !== taskId);
    updateProjectData();
    renderTaskList();
}

function editTask(taskId) {
    const task = taskListArray.find(task => task.taskId === taskId);
    if (task) {
        document.getElementById("txtItem").value = task.taskName;
        document.getElementById("txtDescription").value = task.taskDescription;
        editMode = true;
        editTaskId = taskId;
    }
}

function toggleTaskStatus(taskId) {
    const task = taskListArray.find(task => task.taskId === taskId);
    if (task) {
        task.status = task.status === "pending" ? "completed" : "pending";
        task.updatedDate = new Date().toLocaleString();
        updateProjectData();
        renderTaskList();
    }
}

function removeAll() {
    taskListArray = [];
    updateProjectData();
    renderTaskList();
}

function setFilter(filter) {
    currentFilter = filter;
    renderTaskList();

    document.getElementById("all").classList.remove("active");
    document.getElementById("pending").classList.remove("active");
    document.getElementById("completed").classList.remove("active");
    document.getElementById(filter).classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
    renderTaskList();
});
