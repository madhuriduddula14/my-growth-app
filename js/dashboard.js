// ====================================================================
// GLOBAL INITIALIZATION
// ====================================================================
const today = new Date();
const todayKey = today.toDateString();
document.getElementById("date").innerText = todayKey;

// ====================================================================
// TODAY'S FOCUS MODULE
// ====================================================================
const focusModule = (() => {
  const focusKey = "focus_" + todayKey;
  let focusItems = JSON.parse(localStorage.getItem(focusKey)) || [];
  const focusInput = document.getElementById("focusInput");
  const focusList = document.getElementById("focusList");

  const save = () => {
    localStorage.setItem(focusKey, JSON.stringify(focusItems));
    render();
  };

  const render = () => {
    focusList.innerHTML = "";
    focusItems.forEach((item, index) => {
      const li = document.createElement("li");
      if (item.done) li.classList.add("done");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.done;
      checkbox.onchange = () => {
        item.done = checkbox.checked;
        save();
      };

      const span = document.createElement("span");
      span.className = "focus-text";
      span.innerText = item.text;
      span.onclick = () => {
        const input = document.createElement("input");
        input.value = item.text;
        input.onblur = () => {
          item.text = input.value.trim() || item.text;
          save();
        };
        input.onkeypress = e => e.key === "Enter" && input.blur();
        li.replaceChild(input, span);
        input.focus();
      };

      const del = document.createElement("button");
      del.innerText = "✖";
      del.onclick = () => {
        focusItems.splice(index, 1);
        save();
      };

      const actions = document.createElement("div");
      actions.className = "focus-actions";
      actions.appendChild(del);
      li.append(checkbox, span, actions);
      focusList.appendChild(li);
    });
    updateStats();
  };

  const updateStats = () => {
    const total = focusItems.length;
    const done = focusItems.filter(i => i.done).length;
    const focusStatsEl = document.getElementById("focusStats");
    if (total === 0) {
      focusStatsEl.innerText = "What deserves your attention today?";
    } else if (done === total) {
      focusStatsEl.innerText = `All ${total} items focused. Great work! ✨`;
    } else {
      focusStatsEl.innerText = `${done} / ${total} focused`;
    }
  };

  focusInput.addEventListener("keypress", e => {
    if (e.key === "Enter" && focusInput.value.trim()) {
      focusItems.push({ text: focusInput.value.trim(), done: false });
      focusInput.value = "";
      save();
    }
  });

  render();
})();

// ====================================================================
// TODAY'S TASKS MODULE
// ====================================================================
const taskModule = (() => {
  const taskKey = "tasks_" + todayKey;
  let tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const taskStats = document.getElementById("taskStats");
  const taskTag = document.getElementById("taskTag");

  const save = () => {
    localStorage.setItem(taskKey, JSON.stringify(tasks));
    render();
  };

  const render = () => {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.onchange = () => {
        task.done = checkbox.checked;
        save();
      };

      const span = document.createElement("span");
      span.innerText = task.text;

      const tagEl = document.createElement("span");
      tagEl.className = "task-tag";
      tagEl.innerText = task.tag;

      const del = document.createElement("span");
      del.innerText = "✖";
      del.className = "task-delete";
      del.onclick = () => {
        tasks.splice(index, 1);
        save();
      };

      li.append(checkbox, span, tagEl, del);
      taskList.appendChild(li);
    });
    updateStats();
  };

  const updateStats = () => {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    if (total === 0) {
      taskStats.innerText = "No tasks yet. What's on your mind?";
    } else if (done === 0) {
      taskStats.innerText = `${total} tasks planned today`;
    } else if (done === total) {
      taskStats.innerText = `All ${total} tasks completed! ✅`;
    } else {
      taskStats.innerText = `${done} / ${total} completed`;
    }
  };

  const addDefaultTasks = () => {
    // If no tasks exist for today, populate with defaults
    if (tasks.length === 0) {
      const defaultTasks = [
        { text: "Learn JAVA+DSA", tag: "Learning" },
        { text: "Check and respond to work emails", tag: "Work" },
        { text: "Plan your day's top 3 priorities", tag: "Personal" }
      ];
      tasks = defaultTasks.map(t => ({ 
        id: Date.now() + Math.random(), 
        text: t.text, 
        done: false, 
        tag: t.tag 
      }));
      // We don't save here, to allow carry-forward to potentially add more tasks first
    }
  };

  const carryForward = () => {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = "tasks_" + yesterday.toDateString();
    const yesterdayTasks = JSON.parse(localStorage.getItem(yesterdayKey)) || [];
    const unfinished = yesterdayTasks.filter(t => !t.done);

    if (unfinished.length > 0 && tasks.length === 0) {
      if (confirm(`Carry forward ${unfinished.length} unfinished task(s) from yesterday?`)) {
        tasks = unfinished.map(t => ({ ...t, id: Date.now() + Math.random(), done: false }));
        save();
      }
    }
  };

  taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter" && taskInput.value.trim()) {
      tasks.push({
        id: Date.now(),
        text: taskInput.value.trim(),
        done: false,
        tag: taskTag.value
      });
      taskInput.value = "";
      save();
    }
  });
  
  // Keyboard navigation
  let selectedTaskIndex = -1;
  document.addEventListener("keydown", e => {
    if (tasks.length === 0 || document.activeElement !== document.body) return;
    if (e.key === "ArrowDown") selectedTaskIndex = Math.min(tasks.length - 1, selectedTaskIndex + 1);
    if (e.key === "ArrowUp") selectedTaskIndex = Math.max(0, selectedTaskIndex - 1);
    if (e.key === " ") {
      e.preventDefault(); // Prevent page scroll
      if (tasks[selectedTaskIndex]) {
        tasks[selectedTaskIndex].done = !tasks[selectedTaskIndex].done;
        save();
      }
    }
    if (e.key === "Backspace") {
      if (tasks[selectedTaskIndex]) {
        tasks.splice(selectedTaskIndex, 1);
        save();
        selectedTaskIndex = -1;
      }
    }
    render(); // Re-render to show selection
  });

  addDefaultTasks(); // Add defaults first, if needed
  carryForward();    // Then, check for any tasks to carry forward
  render();          // Finally, render the combined list
})();

// ====================================================================
// STATIC DASHBOARD WIDGETS
// ====================================================================
const heroModule = (() => {
  const hour = new Date().getHours();
  const greetingEl = document.getElementById("heroGreeting");
  const quoteEl = document.getElementById("heroQuote");

  let greeting = "Good day, Madhuri";
  if (hour < 12) greeting = "🌱 Good morning, Madhuri";
  else if (hour < 18) greeting = "☀️ Good afternoon, Madhuri";
  else greeting = "🌙 Good evening, Madhuri";

  const quotes = [
    "Today is about showing up, not perfection.",
    "A little progress each day adds up to big results.",
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "The journey of a thousand miles begins with a single step."
  ];
  
  // Get a new quote each day
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const quote = quotes[dayOfYear % quotes.length];

  greetingEl.innerText = greeting;
  quoteEl.innerText = quote;
})();

const staticWidgetsModule = (() => {
  // Habit Progress
  const habitStatusEl = document.getElementById("habitStatus");
  const habitBar = document.getElementById("habitBar");
  const habitConfig = JSON.parse(localStorage.getItem("habit_config")) || [];
  const activeHabits = habitConfig.filter(h => !h.paused);
  const dailyHabits = JSON.parse(localStorage.getItem("habits_" + todayKey)) || {};
  const doneHabits = Object.values(dailyHabits).filter(v => v).length;
  const habitPercent = activeHabits.length === 0 ? 0 : Math.round((doneHabits / activeHabits.length) * 100);

  if (habitPercent === 100) {
    habitStatusEl.innerHTML = "<strong>Strong day ✨</strong>";
    habitBar.parentElement.classList.add("soft-glow");
  } else if (habitPercent >= 40) {
    habitStatusEl.innerHTML = `<strong>${habitPercent}%</strong> - Good momentum`;
  } else {
    habitStatusEl.innerHTML = `<strong>${habitPercent}%</strong> - Fresh start`;
  }
  habitBar.style.width = habitPercent + "%";

  // Learning Time
  const learningStatusEl = document.getElementById("learningStatus");
  const learningBar = document.getElementById("learningBar");
  const DAILY_TARGET = 120;
  let sessions = JSON.parse(localStorage.getItem("learning_sessions")) || [];
  
  const renderLearning = () => {
    let todayLearning = sessions.filter(s => s.date === todayKey).reduce((sum, s) => sum + s.minutes, 0);
    const learningPercent = Math.min(Math.round((todayLearning / DAILY_TARGET) * 100), 100);

    if (learningPercent === 100) {
      learningStatusEl.innerHTML = `<strong>${todayLearning} min</strong> - Goal met! 🎉`;
      learningBar.parentElement.classList.add("soft-glow");
    } else {
      learningStatusEl.innerHTML = `<strong>${todayLearning}</strong> / ${DAILY_TARGET} min`;
      learningBar.parentElement.classList.remove("soft-glow");
    }
    learningBar.style.width = learningPercent + "%";
  };

  window.addLearning = () => {
    sessions.push({ id: Date.now(), topic: "Quick add", minutes: 30, date: todayKey });
    localStorage.setItem("learning_sessions", JSON.stringify(sessions));
    renderLearning();
  };

  renderLearning();

  // Work Snapshot
  const workNoteEl = document.getElementById("workNote");
  workNoteEl.value = localStorage.getItem("workNote") || "";
  workNoteEl.addEventListener("input", () => localStorage.setItem("workNote", workNoteEl.value));
})();
