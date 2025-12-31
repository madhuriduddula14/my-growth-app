// Function to get the start of the current week (Sunday)
function getWeekStartDate(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

const today = new Date();
const weekStart = getWeekStartDate(today);
const weekKey = "reflection_" + weekStart.toDateString();

document.getElementById("weekRange").innerText = `Week of ${weekStart.toDateString()}`;

const fields = ["good", "hard", "learn", "next"];
let data = JSON.parse(localStorage.getItem(weekKey)) || {};

fields.forEach(id => {
  const el = document.getElementById(id);
  el.value = data[id] || "";
  el.oninput = () => {
    data[id] = el.value;
    localStorage.setItem(weekKey, JSON.stringify(data));
  };
});
