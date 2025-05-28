const url = "https://commumity-server.onrender.com";
// const url = "http://localhost:3000";
const page = document.getElementById("messageboards");
const form = document.getElementById("new-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const values = Object.fromEntries(data);
  values.time_stamp = new Date().getTime();
  console.log(values);
  addBoard(values);
  form.reset();
});

async function addBoard(values) {
  const response = await fetch(url + "/addMsgBoard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await response.json();
  ids.push(data);
}

function buildBoard(data) {
  const contaner = document.createElement("div");
  const link = document.createElement("a");
  const update = document.createElement("p");

  link.href = `./messages?id=${data.id}`;
  link.textContent = data.name;
  const date = new Date(Number(data.updated));
  update.textContent = date.toLocaleString();

  contaner.appendChild(link);
  contaner.appendChild(update);
  page.appendChild(contaner);
}

async function getData() {
  const response = await fetch(url + "/getMsgBoards");
  const data = await response.json();
  return data;
}

function cleanBorads() {
  while (page.firstChild) page.removeChild(page.lastChild);
}

async function work() {
  cleanBorads();
  const data = await getData();
  data.forEach((item) => {
    buildBoard(item);
  });
}

work();
setInterval(() => {
  work();
}, 60000);
