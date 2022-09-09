var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var buttonEl = document.querySelector("#save-task");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
// if element will be referenced more than once, best to assign it to a variable
// if not and query for element is needed, it will search DOM everytime and will
// cause a noticable drain in resources and webpage performance
var tasksToDoEl = document.querySelector("#tasks-to-do");

// creating handler to, create new li, assign class for styling and text content, append to list
var taskFormHandler = function(event) {
    // default behavior of form submit is to refresh page, must prevent this from occuring
    event.preventDefault();
    // using [ ] in a selector means you're trying to select an HTMl element by an attribute
    // ex in this case selecting the <input> element with the name="task-name" attribute
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    // form validation to prevent empty inputs
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();
    var isEdit = formEl.hasAttribute("data-task-id");
    // has data attribute, get task id and call function to complete editing process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, create object as normal and pass to createTaskEl function
    else {
        // package data as object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };
    }
    // send as argument to createTaskEl
    createTaskEl(taskDataObj);
};

var createTaskEl = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = 'task-item';
    // add task id as custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    var taskActionEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionEl);
    tasksToDoEl.appendChild(listItemEl);
    // add entire div to list
    tasksToDoEl.appendChild(listItemEl);
    // increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    // create new div for the content
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    // append edit button
    actionContainerEl.appendChild(editButtonEl);
    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    // append delete button
    actionContainerEl.appendChild(deleteButtonEl);
    // adding dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    // append dropdown
    actionContainerEl.appendChild(statusSelectEl);
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
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
    else if (event.target.matches(".delete-btn")) {
        // get element's unique task id based on user click
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // get content from task name and type based on task list item element (above)
    // this is done since we did not give the h3 and span elements any unique attributes
    // this way we can specifically target which task text we want to edit
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    // change "Add Task" button to "Save Task" to let user know they are editing task
    document.querySelector("#save-task").textContent = "Save Task";
    // this will add `data-task-id` attribute so that we can save edit to the correct task
    formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    alert("Task Updated!");
    // reset form
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var deleteTask = function(taskId) {
    // selecting entire task with it's unique attribute `task-item` and then specifically
    // the clicked element's `data-task-id` to be able to easily remove the entire task
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

var taskStatusChangeHandler = function(event) {
    // get task item id
    var taskId = event.target.getAttribute("data-task-id");
    // get current selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    // find parent task item element based on id
    var taskSelected = document.querySelector(".task-item[data-task-id'" + taskId + "']");
    // moving task to different column
    // key note: this is not making a duplicate, it is moving the element to a new column
    // it will create another li element if we had done `document.createElement()`
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
};

// callback function: on form submit create a task
// targetting entire form, so you do not want to have event listener set to "click"
// or else everytime you click anywhere on the form, callback function will occur
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);