const today = new Date();
const day = today.getDay(); // 0 (Sun) - 6 (Sat)

const weekStart = new Date(today);
weekStart.setDate(today.getDate() - day);

const weekDates = [];
for (let i = 0; i < 7; i++) {
  const d = new Date(weekStart);
  d.setDate(weekStart.getDate() + i);
  weekDates.push(d.toDateString());
}

document.getElementById("range").innerText =
  `${weekDates[0]} → ${weekDates[6]}`;

// ===== Habit Average =====
let habitPercents = [];

weekDates.forEach(date => {
  const habits = JSON.parse(localStorage.getItem("habits_" + date)) || {};
  const values = Object.values(habits);
  if (values.length > 0) {
    const percent = Math.round(
      (values.filter(v => v).length / values.length) * 100
    );
    habitPercents.push(percent);
  }
});

const habitAvg =
  habitPercents.length === 0
    ? 0
    : Math.round(
        habitPercents.reduce((a, b) => a + b, 0) / habitPercents.length
      );

document.getElementById("habitAvg").innerText = habitAvg;

// ===== Learning Summary =====
const sessions = JSON.parse(localStorage.getItem("learning_sessions")) || [];

let weeklyLearning = 0;
let dailyLearning = {};

sessions.forEach(s => {
  if (weekDates.includes(s.date)) {
    weeklyLearning += s.minutes;
    dailyLearning[s.date] =
      (dailyLearning[s.date] || 0) + s.minutes;
  }
});

document.getElementById("learningTotal").innerText = weeklyLearning;

const bars = document.getElementById("weekBars");

weekDates.forEach(date => {
  const mins = dailyLearning[date] || 0;
  const bar = document.createElement("div");
  bar.style.height = Math.min(mins, 120) + "px";
  bars.appendChild(bar);
});

const learningDays = document.getElementById("learningDays");
Object.entries(dailyLearning).forEach(([date, mins]) => {
  const li = document.createElement("li");
  li.textContent = `${date}: ${mins} min`;
  learningDays.appendChild(li);
});

// ===== Work Highlights =====
const highlights = document.getElementById("workHighlights");

weekDates.forEach(date => {
  const work = JSON.parse(localStorage.getItem("work_" + date));
  if (work?.win || work?.learned) {
    const li = document.createElement("li");
    li.textContent = `${date}: ${work.win || work.learned}`;
    highlights.appendChild(li);
  }
});

const insights = document.getElementById("insights");

// Focus insight
if (completion >= 70) {
  insights.innerHTML += "<li>You completed most of your focus items this week 👍</li>";
} else if (completion > 0) {
  insights.innerHTML += "<li>Some focus items slipped — consider planning fewer</li>";
}

// Learning insight
if (weeklyLearning >= 300) {
  insights.innerHTML += "<li>Strong learning consistency this week 📚</li>";
} else {
  insights.innerHTML += "<li>Learning was light — even 20 min/day helps</li>";
}
