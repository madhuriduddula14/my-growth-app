const historyEl = document.getElementById("history");

// Get all focus_* keys
const focusKeys = Object.keys(localStorage)
  .filter(key => key.startsWith("focus_"))
  .sort((a, b) => new Date(b.replace("focus_", "")) - new Date(a.replace("focus_", "")));

if (focusKeys.length === 0) {
  historyEl.innerHTML = "<p>No focus history yet.</p>";
}

focusKeys.forEach(key => {
  const date = key.replace("focus_", "");
  const items = JSON.parse(localStorage.getItem(key)) || [];

  if (items.length === 0) return;

  const section = document.createElement("div");
  section.style.marginBottom = "1.5rem";

  const title = document.createElement("h3");
  title.innerText = date;

  const list = document.createElement("ul");
  list.style.listStyle = "none";
  list.style.padding = "0";

  items.forEach(item => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "10px";
    li.style.opacity = item.done ? "0.6" : "1";

    const status = document.createElement("span");
    status.innerText = item.done ? "✅" : "⬜";

    const text = document.createElement("span");
    text.innerText = item.text;
    if (item.done) text.style.textDecoration = "line-through";

    li.appendChild(status);
    li.appendChild(text);
    list.appendChild(li);
  });

  section.appendChild(title);
  section.appendChild(list);
  historyEl.appendChild(section);
});
