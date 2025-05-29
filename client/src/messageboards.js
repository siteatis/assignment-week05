// const url = "https://commumity-server.onrender.com";
const url = "http://localhost:3000";
const page = document.getElementById("messageboards");
const form = document.getElementById("new-form");
let ids = [];
try {
  const temp = JSON.parse(localStorage.getItem("messageboards"));
  ids = temp ? temp : [];
} catch (error) {}

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
  localStorage.setItem("messageboards", JSON.stringify(ids));
}

function buildBoard(data) {
  const contaner = document.createElement("div");
  const link = document.createElement("a");
  const update = document.createElement("p");
  const deleteBtn = document.createElement("button");

  link.href = `./messages?id=${data.id}`;
  link.textContent = data.name;
  const date = new Date(Number(data.updated));
  update.textContent = date.toLocaleString();
  deleteBtn.textContent = `Delete`;

  deleteBtn.addEventListener("click", () => {
    deleteData(item);
  });

  contaner.appendChild(link);
  contaner.appendChild(update);
  if (
    ids.find((o) => {
      return o[0].id === data.id;
    })
  )
    contaner.appendChild(deleteBtn);
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

function deleteData(values) {
  fetch(`${url}/deleteMsgBoard/${values.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

work();
setInterval(() => {
  work();
}, 60000);
