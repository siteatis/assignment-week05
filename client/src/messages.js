// const url = "https://commumity-server.onrender.com";
const url = "http://localhost:3000";
const page = document.getElementById("messages");
const form = document.getElementById("new-form");
const id = new URLSearchParams(window.location.search).get(`id`);
let ids = [];
try {
  const temp = JSON.parse(localStorage.getItem("messages"));
  ids = temp ? temp : [];
} catch (error) {}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const values = Object.fromEntries(data);
  values.time_stamp = new Date().getTime();
  values.message_board_id = id;
  console.log(values);
  addMsg(values);
  updateBoard(values);
  form.reset();
});

async function addMsg(values) {
  const response = await fetch(url + "/addMsg", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await response.json();
  ids.push(data);
  localStorage.setItem("messages", JSON.stringify(ids));
}

function updateBoard(values) {
  fetch(`${url}/updateMsgBoard/${id}/${values.time_stamp}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
}

function buildMessage(data) {
  const contaner = document.createElement("div");
  const userName = document.createElement("p");
  const message = document.createElement("p");
  const dateMade = document.createElement("p");
  const deleteBtn = document.createElement("button");

  userName.textContent = data.username;
  message.textContent = data.message;
  const date = new Date(Number(data.timestamp));
  dateMade.textContent = date.toLocaleString();
  deleteBtn.textContent = `Delete`;

  deleteBtn.addEventListener("click", () => {
    deleteData(item);
  });

  contaner.appendChild(userName);
  contaner.appendChild(message);
  contaner.appendChild(dateMade);
  if (
    ids.find((o) => {
      return o[0].id === data.id;
    })
  )
    contaner.appendChild(deleteBtn);
  page.appendChild(contaner);
}

async function getData() {
  const response = await fetch(url + "/getMsgs/" + id);
  const data = await response.json();
  return data;
}

function cleanMessages() {
  while (page.firstChild) page.removeChild(page.lastChild);
}

async function work() {
  cleanMessages();
  const data = await getData();
  data.forEach((item) => {
    buildMessage(item);
  });
}

function deleteData(values) {
  fetch(`${url}/deleteMsg/${values.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

work();
setInterval(() => {
  work();
}, 5000);
