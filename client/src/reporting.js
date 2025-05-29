// For consistency copied from Luke's code instead of doing how I did it last week:
// START COPY
// const url = "https://commumity-server.onrender.com";
const SERVER_URL = "http://localhost:3000";
// END COPY

// TODO: Rename "hid-" to e.g. "dis-" throughout

const doc = document;
const log = console.log;

const form = doc.getElementById("main-form");

const optionalParts = getOptionalParts();
initBinsElements();
initLocationsElements();

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  submitReport(new FormData(form));
});

//radiobuttons.addEventListener("onchange", () => {})
// TODO: This is a massive bodge to solve the problem of not being able to find an event for when a set of radio buttons changes but I'm desperately far behind and not able to ask for help so I'm just going to do it in this terrible way and irl this would be fixed later
// TODO: Wow, prettier has really messed this up!
// TODO: Now bodged up with some temp foo vars, will fix after the course when I have time to learn JS & HTML
doc.querySelectorAll('fieldset > input[name="report-type"]').forEach((radio) =>
  radio.addEventListener("change", () => {
    // Handle radio button selection changing: show/hide relevant lower-down parts of form
    let foo2 = "";
    const foo1 = doc.querySelectorAll('[name="report-type"]');
    foo1.forEach((item) => {
      if (item.checked) foo2 = item.value;
    });
    //          .findAll((ele) => ele.checked)[0].value
    optionalParts.forEach(
      (div) => (div.disabled = !div.classList.contains("hid-" + foo2))
    );
  })
);

// TODO: Obviously there must be something to "do array.find when it's not an array" built into JS but I just cannot afford to spend anmy more time trying to find it so I'm going to very clumsily replicate it here!
/*function findAll(iterable, predicate) {
  const result = [];
  let i = 0;
  iterable.forEach((item) => {
    if (predicate(item)) result[i++] = item;
  });
  return result;
}*/
// TODO: Having done it, that won't work either as I don't know enough about JS to try and look for a way of making it callable on the object, so back to the drawing board. Decided to bodge it up another way (see foo vars above)

// Get all three of the optionally-displayed parts of the form
function getOptionalParts() {
  return doc.querySelectorAll('[class^="hid-"]');
}

async function initBinsElements() {
  const rsp = await fetch(SERVER_URL + "/getBins");
  const parent = doc.getElementById("bins-dropdown");
  (await rsp.json()).forEach((bin) => {
    const o = doc.createElement("option");
    o.value = bin.id;
    o.textContent = bin.description;
    parent.appendChild(o);
  });
}

function initLocationsElements() {
  const parent = doc.getElementById("foul-dropdown");
  // TODO: Very sloppy, just throwing it together to try and catch up
  [
    "Northwest path",
    "Skate park",
    "Eastern path",
    "Grassy knoll",
    "Main entrance",
  ].forEach((locDesc, i) => {
    const o = doc.createElement("option");
    o.value = i; // TODO: Just index for now, will be replaced by location ID in stretch goal
    o.textContent = locDesc;
    parent.appendChild(o);
  });
}

async function submitReport(formData) {
  const data = Object.fromEntries(formData);
  data.username = data.username;
  data.bin_id = 0; // TODO : data. TODO: have to finish super ASAP so te=am may have a chance of completing before deadline, can't do this, very easy but needs refer to notes to get selected bin dropdown option, also same problem as below with comments, just need a quick function to know which visible part of we're on I guess
  data.incident_id = 0; // TODO: Turns out temp bodge above breaks DB schema, leave blank for now, fix when bodge fixed
  data.comments = data.comments; // TODO: temp bodge to allow testing, won't work like this as user can type comments then switch radio to bins/dog-foul
  data.when_reported = Date.now();
  const rsp = await fetch(SERVER_URL + "/submitReport", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
  formData.form.reset(); // Because we suppressed default, the form wasn't reset
}
