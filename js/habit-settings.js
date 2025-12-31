const HABIT_CONFIG_KEY = "habit_config";

// Default habits if none exist
const defaultHabits = [
  { id: "morning", text: "Morning routine", category: "🌅 Morning", paused: false },
  { id: "learning", text: "Learning session", category: "📚 Growth", paused: false },
  { id: "study-1hr", text: "Study 1 hour by 9am", category: "📚 Growth", paused: false },
  { id: "walk", text: "Walk / movement", category: "💚 Health", paused: false },
  { id: "health", text: "Health / tablets", category: "💚 Health", paused: false },
  { id: "sleep", text: "Sleep on time", category: "💚 Health", paused: false },
];

let habits = JSON.parse(localStorage.getItem(HABIT_CONFIG_KEY)) || defaultHabits;

const habitListEl = document.getElementById("habitList");
const addHabitBtn = document.getElementById("addHabitBtn");
const newHabitTextEl = document.getElementById("newHabitText");
const newHabitCategoryEl = document.getElementById("newHabitCategory");

function saveHabits() {
  localStorage.setItem(HABIT_CONFIG_KEY, JSON.stringify(habits));
  renderHabits();
}

function renderHabits() {
  habitListEl.innerHTML = "";
  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "10px";
    li.style.padding = "8px 0";
    li.style.opacity = habit.paused ? 0.5 : 1;

    const text = document.createElement("span");
    text.innerText = `${habit.category} - ${habit.text}`;
    text.style.flex = 1;
    text.onclick = () => {
      const newText = prompt("Rename habit:", habit.text);
      if (newText && newText.trim()) {
        habit.text = newText.trim();
        saveHabits();
      }
    };

    const pauseBtn = document.createElement("button");
    pauseBtn.innerText = habit.paused ? "▶️" : "⏸️";
    pauseBtn.onclick = () => {
      habit.paused = !habit.paused;
      saveHabits();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "✖️";
    deleteBtn.onclick = () => {
      if (confirm(`Delete "${habit.text}"? This cannot be undone.`)) {
        habits.splice(index, 1);
        saveHabits();
      }
    };

    li.append(text, pauseBtn, deleteBtn);
    habitListEl.appendChild(li);
  });
}

addHabitBtn.addEventListener("click", () => {
  const text = newHabitTextEl.value.trim();
  if (!text) return;

  habits.push({
    id: text.toLowerCase().replace(/\s+/g, "-"), // simple id generation
    text: text,
    category: newHabitCategoryEl.value,
    paused: false
  });

  newHabitTextEl.value = "";
  saveHabits();
});

// Initial render
renderHabits();
