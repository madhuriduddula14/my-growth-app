const today = new Date();
const todayKey = today.toDateString();
document.getElementById("date").innerText = todayKey;

const STORAGE_KEY = "learning_sessions";
let sessions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function addSession() {
  const topicEl = document.getElementById("topic");
  const minutesEl = document.getElementById("minutes");

  const topic = topicEl.value.trim();
  const minutes = Number(minutesEl.value);

  if (!topic || minutes <= 0) return;

  sessions.push({
    id: Date.now(), // Add a unique ID for deletion
    topic,
    minutes,
    date: todayKey
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  topicEl.value = "";
  minutesEl.value = "";
  render();
}

function deleteSession(id) {
  sessions = sessions.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  render();
}

function render() {
  // === Render session list ===
  const listEl = document.getElementById("sessions");
  listEl.innerHTML = "";
  const todaySessions = sessions.filter(s => s.date === todayKey);

  todaySessions.forEach(s => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.marginBottom = "0.5rem";
    
    const text = document.createElement("span");
    text.innerText = `${s.topic} – ${s.minutes} min`;
    text.style.flex = "1";

    const del = document.createElement("button");
    del.innerText = "✖";
    del.onclick = () => deleteSession(s.id);

    li.append(text, del);
    listEl.appendChild(li);
  });

  // === Calculate and render today's total and progress bar ===
  const todayTotal = todaySessions.reduce((sum, s) => sum + s.minutes, 0);
  document.getElementById("todayTotal").innerText = todayTotal;

  const DAILY_TARGET = 120;
  const learningPercent = Math.min(Math.round((todayTotal / DAILY_TARGET) * 100), 100);
  document.getElementById("learningBar").style.width = learningPercent + "%";

  // === Calculate and render weekly bar chart ===
  const weekBars = document.getElementById("weekBars");
  weekBars.innerHTML = "";
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateKey = d.toDateString();

    const dayTotal = sessions
      .filter(s => s.date === dateKey)
      .reduce((sum, s) => sum + s.minutes, 0);

    const bar = document.createElement("div");
    bar.style.height = Math.min(dayTotal, 120) + "px";
    bar.title = `${dateKey}: ${dayTotal} min`; // Tooltip for details
    weekBars.appendChild(bar);
  }
}

render();
