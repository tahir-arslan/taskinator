var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) {
    // Prevent default browser fxn by preventing refresh on submission
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // form validation
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset form
    formEl.reset();

    // check to see if form element has data-task-id via .hasAttribute
    var isEdit = formEl.hasAttribute("data-task-id");
    // if element has data attribute, get task ID and call fxn to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
        // no data attribute present, create object as normal to create new task
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
    };

    //send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
};

var createTaskEl = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    
    var taskActionEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionEl);
    
    // add list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    saveTasks();
    // increase task counter by 1 for next unique ID for (above)
    taskIdCounter++;

};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // 'edit' button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

    // 'delete' button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl);
    };

    return actionContainerEl;
};

var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    // edit button clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    // delete button clicked
    else if (targetEl.matches(".delete-btn")) {
        // get element task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    };
};

var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // update fields to input task fields being edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // set new values to the task being edited
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        };
    };
    alert("Task Updated!");

    // reset form button from "Edit Task" to "Add Task"
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
    saveTasks();
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i].id doesn't match value of taskId, keep that task and push it into new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        };
    };

    // reassign tasks array to be same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
};

var taskStatusChangeHandler = function(event) {
    // get task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get value of currently selected option, then convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find parent task item element based on Id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    };

    // update tasks in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        };
    };
    saveTasks();
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// pseudocode:
// 1. Gets task items from localStorage.
// 2. Converts tasks from the string format back into an array of objects.
// 3. Iterates through a tasks array and creates task elements on the page from it.
var loadTasks = function() {
    var savedTasks = localstorage.getItem("tasks");
    // if no tasks, set tasks to empty array and exit fxn
    if (!savedTasks) {
        return false;
    };

    // parse back into array of objects from localStorage
    savedTasks = JSON.parse(savedTasks);

    // loop through array of objects
    for (i = 0; i < savedTasks.length; i++) {
        console.log(tasks[i]);
    }
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);