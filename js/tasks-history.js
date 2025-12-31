const container = document.getElementById("taskHistory");

const taskKeys = Object.keys(localStorage)
  .filter(k => k.startsWith("tasks_"))
  .sort((a, b) => new Date(b.replace("tasks_", "")) - new Date(a.replace("tasks_", "")));

taskKeys.forEach(key => {
  const date = key.replace("tasks_", "");
  const tasks = JSON.parse(localStorage.getItem(key)) || [];

  if (tasks.length === 0) return;

  const section = document.createElement("div");
  section.style.marginBottom = "1.5rem";

  const title = document.createElement("h3");
  title.innerText = date;

  const ul = document.createElement("ul");
  ul.style.listStyle = "none";
  ul.style.padding = "0";

  tasks.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `${t.done ? "✅" : "⬜"} ${t.text} <small>(${t.tag})</small>`;
    ul.appendChild(li);
  });

  section.append(title, ul);
  container.appendChild(section);
});
