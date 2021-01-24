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
  const $itemRowElement = $(this).parent().parent();
  const currentItem = $itemRowElement.children(".js-item").text().trim();
  const currentStatus = "Y";
  const completedItem = {
    item: currentItem,
    complete: currentStatus,
  };
  updateTask(completedItemId, completedItem);
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
      console.warn("There was an error getting the list");
    });
}

// clear the container on the dom and run a loop through the tasklist array.
// append item with delete button and complete button on same row.
// add 'complete' class if status is Y.
function render() {
  $(".js-container").empty();
  for (let i = 0; i < taskList.length; i++) {
    const item = taskList[i];
    $(".js-container").append(`
    <tr class="row">
      <td class ="js-item">${item.item}</td>
      <td><button class ="js-btn-complete" data-id="${item.id}" data-index="${i}">Complete</button></td>
      <td><button class ="js-btn-delete" data-id="${item.id}">Delete</button></td>
    </tr>`);
    if (item.complete === "Y") {
      const $el = $(".js-container").children().last();
      $el.addClass("complete");
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
      console.warn("There was an error saving the new item");
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
      console.warn("There was an error updating completed item");
    });
}