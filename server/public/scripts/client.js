// runs start when document is ready
$(document).ready(start);
// global variables
let itemList = [];
let completedItemId = 0;

function start() {
  // run getList function
  getList();
  // when Add Task button is clicked, run clickAdd
  $(".js-btn-add").on("click", clickAdd);
};


// when clicked get info from dom, send to saveItem, clear input.
function clickAdd() {
  const newItem = {
    item: $(".js-new-item").val(),
    complete: "N",
  };
  saveItem(newItem);
  $(".js-new-item").val("");
}

// get the data from router using 'GET' method using '/tasks' route.
// save the response as taskList then run render function with the taskList array.
function getList() {
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
function saveItem(newItem) {
  $.ajax({
    method: "POST",
    url: "/tasks",
    data: newItem,
  })
    .then((response) => {
      getList();
    })
    .catch((err) => {
      console.log("Error:", err);
      console.warn("There was an error saving the new item");
    });
}
