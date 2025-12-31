const today = new Date().toDateString();
document.getElementById("date").innerText = today;

const STORAGE_KEY = "work_" + today;

const fields = ["worked", "learned", "blocker", "win"];

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

fields.forEach(id => {
  const el = document.getElementById(id);
  el.value = data[id] || "";

  el.addEventListener("input", () => {
    data[id] = el.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  });
});
