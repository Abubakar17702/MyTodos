// Toastify Notification
function showNotification(msg, type) {
  let bgColor;
  switch (type) {
    case "success":
      bgColor = "#5cb85c";
      break;
    case "error":
      bgColor = "#FF3333";
      break;
    default:
      bgColor = "#000";
      break;
  }

  Toastify({
    text: msg,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "bottom",
    position: "left",
    stopOnFocus: true,
    style: {
      background: bgColor,
    },
    onClick: function() {}
  }).showToast();
}

// Constructor
function TODO(title, location, description) {
  this.title = title;
  this.location = location;
  this.description = description;
}

// GET RANDOM VALUE
function getRandomId() {
  return Math.random().toString(36).slice(2);
}

// GET INPUT VALUE
function getInput(inputValue) {
  return document.getElementById(inputValue).value;
}

// CLEAR OUTPUT
function clearOutput() {
  document.getElementById("output").innerHTML = "";
}

// ADD TASK
function addTask(event) {
  event.preventDefault();
  let title = getInput("title").trim();
  let location = getInput("location").trim();
  let description = getInput("description").trim();

  if (title.length < 3) {
    showNotification("Please Enter Your Correct Title", "error");
    return;
  }

  if (location.length < 3) {
    showNotification("Please Enter Your Correct Location", "error");
    return;
  }

  if (description.length < 10) {
    showNotification("Please Enter Your Correct Description", "error");
    return;
  }

  let toDo = new TODO(title, location, description);
  toDo.id = getRandomId();
  toDo.dateCreated = new Date().getTime();
  toDo.status = "active";

  let toDos = JSON.parse(localStorage.getItem("toDos")) || [];
  toDos.push(toDo);
  localStorage.setItem("toDos", JSON.stringify(toDos));

  let formattedDate = new Date(toDo.dateCreated).toLocaleString();
  let outputMessage = `Title: "${title}", Location: "${location}" has been successfully added on ${formattedDate}.`;
  document.getElementById("output").innerHTML = outputMessage;

  showNotification(outputMessage, "success");
  showTable();
}

// SHOW TABLE
function showTable(event) {
  clearOutput();
  let toDos = JSON.parse(localStorage.getItem("toDos")) || [];

  if (!toDos.length) {
    document.getElementById("output").innerHTML = "<b>Hurry! No task available. Add a task to get started.</b>";
    showNotification('There is not a single task available.', 'error');
    return;
  }

  let tableStart = '<div class="table-responsive"><table class="table">';
  let tableEnd = '</table></div>';
  let tableHead = '<thead><tr><th scope="col">#</th><th scope="col">Title</th><th scope="col">Location</th><th scope="col">Description</th><th scope="col" rowspan="2">Actions</th><td></td></tr></thead>';
  let tableBody = '';

  for (let i = 0; i < toDos.length; i++) {
    let toDo = new TODO(toDos[i].title, toDos[i].location, toDos[i].description);
    toDo.id = toDos[i].id;  // Ensure the ID is maintained
    tableBody += `<tr><th scope="col">${i + 1}</th><td>${toDo.title}</td><td>${toDo.location}</td><td>${toDo.description}</td><td><button class="btn btn-info" data-value="${toDo.id}" onclick="editTodo(event);">Edit</button></td><td><button class="btn btn-danger" data-value="${toDo.id}" onclick="deleteTodo(event);">Delete</button></td></tr>`;
  }

  let fullTable = tableStart + tableHead + '<tbody>' + tableBody + '</tbody>' + tableEnd;
  document.getElementById("output").innerHTML = fullTable;
}

// // EDIT TODO
function editTodo(event) {
  let toDoId = event.target.getAttribute("data-value");
  const toDos = JSON.parse(localStorage.getItem("toDos"));

  let toDo = toDos.find(todo => todo.id === toDoId);
  if (toDo) {
    document.getElementById("title").value = toDo.title;
    document.getElementById("location").value = toDo.location;
    document.getElementById("description").value = toDo.description;
    
    document.getElementById("addTask").style.display = "none";
    document.getElementById("updateTask").style.display = "block";
    
    document.getElementById("updateTask").setAttribute("data-id", toDoId);
  }
}


// DELETE TODO
function deleteTodo(event) {
  let toDoId = event.target.getAttribute("data-value");
  let toDos = JSON.parse(localStorage.getItem("toDos"));

  let updatedToDos = toDos.filter(todo => todo.id !== toDoId);
  localStorage.setItem("toDos", JSON.stringify(updatedToDos));

  showNotification('Task deleted successfully', 'success');
  showTable(event);
}
