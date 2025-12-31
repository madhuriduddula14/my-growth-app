// ====================================================================
// INITIALIZATION
// ====================================================================
const today = new Date();
const todayKey = today.toDateString();
document.getElementById("date").innerText = todayKey;

const HABIT_CONFIG_KEY = "habit_config";
const DAILY_STORAGE_PREFIX = "habits_";
const dailyStorageKey = DAILY_STORAGE_PREFIX + todayKey;

// Load master habit configuration
const defaultHabits = [
  { id: "morning", text: "Morning routine", category: "🌅 Morning", paused: false },
  { id: "learning", text: "Learning session", category: "📚 Growth", paused: false },
  { id: "walk", text: "Walk / movement", category: "💚 Health", paused: false },
  { id: "health", text: "Health / tablets", category: "💚 Health", paused: false },
  { id: "sleep", text: "Sleep on time", category: "💚 Health", paused: false },
];
let allHabits = JSON.parse(localStorage.getItem(HABIT_CONFIG_KEY)) || defaultHabits;
let activeHabits = allHabits.filter(h => !h.paused);

// Load today's completion data
let dailyCompletions = JSON.parse(localStorage.getItem(dailyStorageKey)) || {};

// ====================================================================
// DYNAMICALLY RENDER HABIT LIST
// ====================================================================
const habitListContainer = document.getElementById("dynamicHabitList");
habitListContainer.innerHTML = "";

const groupedHabits = activeHabits.reduce((groups, habit) => {
  const key = habit.category;
  if (!groups[key]) groups[key] = [];
  groups[key].push(habit);
  return groups;
}, {});

for (const category in groupedHabits) {
  const heading = document.createElement("h4");
  heading.innerText = category;
  habitListContainer.appendChild(heading);

  groupedHabits[category].forEach(habit => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.habit = habit.id;
    checkbox.checked = dailyCompletions[habit.id] || false;

    checkbox.addEventListener("change", () => {
      dailyCompletions[habit.id] = checkbox.checked;
      localStorage.setItem(dailyStorageKey, JSON.stringify(dailyCompletions));
      render();
    });

    label.appendChild(checkbox);
    label.append(` ${habit.text}`);
    habitListContainer.appendChild(label);
  });
}

// ====================================================================
// RENDER FUNCTION (Progress, Status, and Weekly View)
// ====================================================================
function render() {
  const total = activeHabits.length;
  const done = Object.values(dailyCompletions).filter(v => v).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const habitBar = document.getElementById("habitBar");

  habitBar.style.width = percent + "%";

  // Micro-celebration: Soft glow
  habitBar.parentElement.classList.toggle("soft-glow", done === 1 && total > 1);

  // Smart status message
  const status = document.getElementById("habitStatus");
  const hour = new Date().getHours();
  if (percent === 100) {
    status.innerText = "✨ All done. Well done.";
  } else if (hour < 12) {
    status.innerText = percent > 0 ? "👍 Great start!" : "🌅 Fresh start.";
  } else if (hour < 18) {
    status.innerText = percent >= 50 ? "💪 Good momentum!" : "☀️ Afternoon check-in.";
  } else {
    status.innerText = percent >= 80 ? "✅ Strong finish!" : "🌃 Winding down.";
  }

  // Weekly heat strip and streak detection
  const weekContainer = document.getElementById("weekHabits");
  weekContainer.innerHTML = "";
  let streak = 0;
  let maxStreak = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = DAILY_STORAGE_PREFIX + d.toDateString();
    const dayData = JSON.parse(localStorage.getItem(key)) || {};
    const dayTotal = allHabits.filter(h => !h.paused).length; // Use master list for total
    const dayDone = Object.values(dayData).filter(v => v).length;
    const dayPercent = dayTotal === 0 ? 0 : Math.round((dayDone / dayTotal) * 100);

    if (dayPercent >= 60) streak++; else streak = 0;
    maxStreak = Math.max(maxStreak, streak);

    const strip = document.createElement("div");
    strip.className = "heat-strip";
    const dayLabel = document.createElement("div");
    dayLabel.className = "heat-day";
    dayLabel.innerText = d.toDateString().slice(0, 3);
    const blocksContainer = document.createElement("div");
    blocksContainer.className = "heat-blocks";
    for (let j = 1; j <= 5; j++) {
      const block = document.createElement("div");
      block.className = "heat-block";
      if (dayPercent >= j * 20) block.classList.add("filled");
      blocksContainer.appendChild(block);
    }
    strip.append(dayLabel, blocksContainer);
    weekContainer.appendChild(strip);
  }

  if (maxStreak >= 3) {
    status.innerHTML += ` 🔥 ${maxStreak}-day streak!`;
  }
}

render(); // Initial render
