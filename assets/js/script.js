var formEl = document.querySelector("#task-form");
var buttonEl = document.querySelector("#save-task");
// if element will be referenced more than once, best to assign it to a variable
// if not and query for element is needed, it will search DOM everytime and will
// cause a noticable drain in resources and webpage performance
var tasksToDoEl = document.querySelector("#tasks-to-do");

// creating handler to, create new li, assign class for styling and text content, append to list
var createTaskHandler = function(event) {
    // default behavior of form submit is to refresh page, must prevent this from occuring
    event.preventDefault();
    var listItemEl = document.createElement("li");
    listItemEl.className = 'task-item';
    listItemEl.textContent = "This is a new task.";
    tasksToDoEl.appendChild(listItemEl);
}

// callback function: on form submit create a task
// targetting entire form, so you do not want to have event listener set to "click"
// or else everytime you click anywhere on the form, callback function will occur
formEl.addEventListener("submit", createTaskHandler);