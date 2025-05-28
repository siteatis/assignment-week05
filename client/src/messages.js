const url = "https://commumity-server.onrender.com";
// const url = "http://localhost:3000";
const page = document.getElementById("messages");
const form = document.getElementById("new-form");
const id = new URLSearchParams(window.location.search).get(`id`);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const values = Object.fromEntries(data);
  values.time_stamp = new Date().getTime();
  values.message_board_id = id;
  console.log(values);
  addMsg(values);
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
}

function buildMessage(data) {
  const contaner = document.createElement("div");
  const userName = document.createElement("p");
  const message = document.createElement("p");
  const dateMade = document.createElement("p");

  userName.textContent = data.user_name;
  message.textContent = data.message;
  const date = new Date(Number(data.time_stamp));
  dateMade.textContent = date.toLocaleString();

  contaner.appendChild(userName);
  contaner.appendChild(message);
  contaner.appendChild(dateMade);
  page.appendChild(contaner);
}

async function getData() {
  const response = await fetch(url + "/getMsg/" + id);
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

work();
setInterval(() => {
  work();
}, 1000);
