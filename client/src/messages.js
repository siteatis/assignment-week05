// const url = "https://commumity-server.onrender.com";
const url = "http://localhost:3000";
const page = document.getElementById("messages");
const form = document.getElementById("new-form");
const params = new URLSearchParams(window.location.search);
const id = params.get(`id`);
let ids = [];
try {
  const temp = JSON.parse(localStorage.getItem("messages"));
  ids = temp ? temp : [];
} catch (error) {}

const title = document.getElementById("titel");
title.textContent = params.get(`title`);

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
  work();
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
  const nameDateDeletecon = document.createElement("div");
  const messageCon = document.createElement("div");

  userName.className = "username";
  message.className = "message";
  dateMade.className = "datemade";
  deleteBtn.className = "deletebtn";
  nameDateDeletecon.className = "nDDcon";
  messageCon.className = "messageCon";
  contaner.className = "mainCon";

  userName.textContent = data.username;
  message.textContent = data.message;
  const date = new Date(Number(data.timestamp));
  dateMade.textContent = "Date made: " + date.toLocaleString();
  deleteBtn.textContent = `Delete`;

  deleteBtn.addEventListener("click", () => {
    deleteData(data);
  });

  nameDateDeletecon.appendChild(userName);
  nameDateDeletecon.appendChild(dateMade);
  if (
    ids.find((values) => {
      return values[0].id === data.id;
    })
  )
    nameDateDeletecon.appendChild(deleteBtn);
  messageCon.appendChild(message);
  contaner.appendChild(nameDateDeletecon);
  contaner.appendChild(messageCon);

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

async function deleteData(values) {
  await fetch(`${url}/deleteMsg/${values.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  work();
}

work();
setInterval(() => {
  work();
}, 60000);
