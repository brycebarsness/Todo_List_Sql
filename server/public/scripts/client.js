// runs start when document is ready
$(document).ready(start);
// global variables
let itemList = [];
let completedItemId = 0;

function start() {
  // run getTask function
  getTask();
  // when Add Task button is clicked, run addTask
  $(".js-btn-add").on("click", addTask);
    // when complete button in js-container is clicked, run completeTask.
  $(".js-container").on("click", ".js-btn-complete", completeTask);
   // when delete button in js-container is clicked, run clickDelete
  $(".js-container").on("click", ".js-btn-delete", deleteBtn);
};


// when clicked get info from dom, send to saveItem, clear input.
function addTask() {
  const newItem = {
    item: $(".js-new-item").val(),
    complete: "N",
  };
  saveTask(newItem);
  $(".js-new-item").val("");
}

// collect id from click event, target row using parent(), set current status to Y, 
// and send completedItem object to updateTask.
function completeTask(event) {
  completedItemId = event.target.dataset.id;
  const $itemRowElement = $(this).closest("tr");
  const currentItem = $itemRowElement.children(".js-item").text().trim();
  const completedItem = {
    item: currentItem,
  };
  if($itemRowElement.hasClass('complete')){
    completedItem.complete = "N";
  } 
  else {
    completedItem.complete = "Y";
  }
  
  updateTask(completedItemId, completedItem);
}

// save the id of the item for the clicked delete button.
// send the item id to deleteTask function
function deleteBtn(event) {
  console.log(this);
  const itemId = event.target.dataset.id;
  deleteTask(itemId);
}

// get the data from router using 'GET' method using '/tasks' route.
// save the response as taskList then run render function with the taskList array.
function getTask() {
  $.ajax({
    method: "GET",
    url: "/tasks",
  })
    .then((response) => {
      taskList = response;
      render(taskList);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
}

// clear the container on the dom and run a loop through the tasklist array.
// append item with delete button and complete button on same row.
// add 'complete' class if status is Y.
function render() {
  $(".js-container").empty();
  let todo = $(".js-container.todo");
  let done = $(".js-container.done");
  console.log(`todo: ${todo}, done: ${done}`);
  for (let i = 0; i < taskList.length; i++) {
    const item = taskList[i];
    let taskEl = $(`
      <tr class="row">     
        <td class ="js-item">${item.item}</td>
        <td><button class ="js-btn-complete" data-id="${item.id}" data-index="${i}">${(item.complete === "Y") ? "reset" : "complete"}</button></td>
        <td><button class ="js-btn-delete" data-id="${item.id}">Delete</button></td>
      </tr>`);
    if (item.complete === "Y") {
      taskEl.addClass("complete");  //line: 78--${(item.complete === "Y") ? "complete" : ""}
      done.append(taskEl);
    }                           
    else{ 
      todo.append(taskEl);
    }
  }
}

// Send newItem to router url /tasks with POST, then use getList to update dom.
function saveTask(newItem) {
  $.ajax({
    method: "POST",
    url: "/tasks",
    data: newItem,
  })
    .then((response) => {
      getTask();
    })
    .catch((err) => {
      console.log("Error:", err);
    });
}

// update task item through router at url /tasks/${id}, then call getTask to reset dom.
function updateTask(id, completedItem) {
  $.ajax({
    method: "PUT",
    url: `/tasks/${id}`,
    data: completedItem,
  })
    .then((response) => {
      getTask();
    })
    .catch((err) => {
      console.log("Error:", err);
    });
}

// Send delete info to router at url /tasks/${id}, run getTask on response.
function deleteTask(id) {
  $.ajax({
    method: "DELETE",
    url: `/tasks/${id}`,
  })
    .then((response) => {
      console.log("Delete", response);
      getTask();
    })
    .catch((err) => {
      console.log("Error:", err);
    });
}