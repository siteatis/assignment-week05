// Navbar

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

// ====================================================================================
// Footer

const pageFooter = document.querySelector("footer");

let footerElements = [
  { text: "Community Park Maintenance" },
  { text: "Phone: 0103202010230302" },
  { text: "communityparkmaintenance@gov.co.uk" },
  { text: "Office Address: council offices, 10 high street, Norwich, NR1 3dr" },
];

function createFooter(array) {
  array.forEach((item) => {
    const pTag = document.createElement("p");
    pTag.textContent = item.text;
    pTag.className = "footerp";
    pageFooter.appendChild(pTag);
  });
}

createFooter(footerElements);
