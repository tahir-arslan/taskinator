varbuttonEl = document.querySelector("#save-task");
// if element will be referenced more than once, best to assign it to a variable
// if not and query for element is needed, it will search DOM everytime and will
// cause a noticable drain in resources and webpage performance
var tasksToDoEl = document.querySelector("#tasks-to-do");

// creating handler to, create new li, assign class for styling and text content, append to list
var createTaskHandler = function() {
    var listItemEl = document.createElement("li");
    listItemEl.className = 'task-item';
    listItemEl.textContent = "This is a new task.";
    tasksToDoEl.appendChild(listItemEl);
}

// callback function: on button click create a task
buttonEl.addEventListener("click", createTaskHandler);