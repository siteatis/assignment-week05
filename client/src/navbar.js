const pageHeader = document.querySelector("header");

let navbarLinks = [
  { navName: "Home", navLink: "./index.html" },
  { navName: "Message Board", navLink: "./messageboards.html" },
  { navName: "Report an Issue", navLink: "#" },
];

const navBar = document.createElement("ul");
navBar.className = "navbar";
pageHeader.appendChild(navBar);

function createNavBar(array) {
  array.forEach((item) => {
    const list = document.createElement("li");
    const link = document.createElement("a");

    link.href = item.navLink;
    link.textContent = item.navName;
    link.className = "navbarlinks";

    navBar.appendChild(list);
    list.appendChild(link);
  });
}

createNavBar(navbarLinks);
