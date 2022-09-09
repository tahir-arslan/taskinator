var formEl = document.querySelector("#task-form");
var buttonEl = document.querySelector("#save-task");
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
    // package data as object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };
    // send as argument to createTaskEl
    createTaskEl(taskDataObj);
}

var createTaskEl = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = 'task-item';
    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    // add entire div to list
    tasksToDoEl.appendChild(listItemEl);
}

// callback function: on form submit create a task
// targetting entire form, so you do not want to have event listener set to "click"
// or else everytime you click anywhere on the form, callback function will occur
formEl.addEventListener("submit", taskFormHandler);