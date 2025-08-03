document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      // Save to localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);

      // Redirect to home
      window.location.href = "home.html";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const storedEmail = localStorage.getItem("userEmail");
      const storedPassword = localStorage.getItem("userPassword");

      if (email === storedEmail && password === storedPassword) {
        window.location.href = "home.html";
      } else {
        alert("❌ Invalid email or password!");
      }
    });
  }
});
// Future features like logout, greeting time logic, or interactive tasks can go here

document.addEventListener("DOMContentLoaded", () => {
  console.log("Home page loaded.");
});
document.addEventListener("DOMContentLoaded", () => {
  const routineForm = document.getElementById("routineForm");
  const timeInput = document.getElementById("timeInput");
  const taskInput = document.getElementById("taskInput");
  const routineList = document.getElementById("routineList");

  let routines = JSON.parse(localStorage.getItem("routines")) || [];
  let lastResetDate = localStorage.getItem("lastResetDate");

  const today = new Date().toISOString().split("T")[0];
  if (lastResetDate !== today) {
    routines.forEach(r => r.done = false); // Reset daily
    localStorage.setItem("lastResetDate", today);
    localStorage.setItem("routines", JSON.stringify(routines));
  }

  function renderRoutines() {
    routineList.innerHTML = "";
    if (routines.length === 0) {
      routineList.innerHTML = "<p>No routine yet. Please add your tasks.</p>";
      return;
    }

    routines.forEach((routine, index) => {
      const item = document.createElement("div");
      item.className = "routine-item" + (routine.done ? " completed" : "");
      item.innerHTML = `
        <div>
          ⏰ <strong>${routine.time}</strong> - ${routine.task}
        </div>
        <div>
          <button onclick="toggleDone(${index})">
            ${routine.done ? "✅ Done" : "✔️ Mark Done"}
          </button>
          <button onclick="deleteRoutine(${index})">🗑️</button>
        </div>
      `;
      routineList.appendChild(item);
    });
  }

  routineForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const time = timeInput.value;
    const task = taskInput.value.trim();

    if (time && task) {
      routines.push({ time, task, done: false });
      localStorage.setItem("routines", JSON.stringify(routines));
      renderRoutines();
      routineForm.reset();
    }
  });

  window.toggleDone = function(index) {
    routines[index].done = !routines[index].done;
    localStorage.setItem("routines", JSON.stringify(routines));
    renderRoutines();
  };

  window.deleteRoutine = function(index) {
    routines.splice(index, 1);
    localStorage.setItem("routines", JSON.stringify(routines));
    renderRoutines();
  };

  renderRoutines();
});
const taskList = document.getElementById("taskList");

let allTasks = [];

function addTask() {
  const name = document.getElementById("taskName").value.trim();
  const deadline = document.getElementById("taskDeadline").value;
  const category = document.getElementById("taskCategory").value;
  const created = new Date();

  if (!name || !deadline) {
    alert("Please fill in all fields.");
    return;
  }

  const task = {
    name,
    deadline: new Date(deadline),
    category,
    created
  };

  allTasks.push(task);
  renderTasks(allTasks);
  clearInputs();
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = `task ${task.category.toLowerCase()}`;

    div.innerHTML = `
      <strong>${task.name}</strong><br>
      🕒 Created: ${task.created.toLocaleString()}<br>
      ⏳ Deadline: ${task.deadline.toLocaleString()}<br>
      📂 Category: ${task.category}
    `;

    taskList.appendChild(div);
  });
}

function filterByTime() {
  const from = new Date(document.getElementById("filterFrom").value);
  const to = new Date(document.getElementById("filterTo").value);

  const filtered = allTasks.filter(task =>
    task.created >= from && task.created <= to
  );

  renderTasks(filtered);
}

function filterByCategory(category) {
  const filtered = allTasks.filter(task =>
    task.category.toLowerCase() === category.toLowerCase()
  );
  renderTasks(filtered);
}

function resetFilter() {
  renderTasks(allTasks);
}

function clearInputs() {
  document.getElementById("taskName").value = "";
  document.getElementById("taskDeadline").value = "";
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const todayDate = new Date().toISOString().split("T")[0];

  const TASK_KEY = "allTasks";

  function loadTasks() {
    return JSON.parse(localStorage.getItem(TASK_KEY)) || [];
  }

  function saveTasks(tasks) {
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  }

  function renderTodayTasks() {
    const tasks = loadTasks();
    const todayTasks = tasks.filter(
      task => task.date === todayDate && !task.completed
    );

    taskList.innerHTML = "";

    if (todayTasks.length === 0) {
      taskList.innerHTML = `<div class="no-tasks">🎉 No tasks for today.</div>`;
      return;
    }

    todayTasks.forEach((task, index) => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task";

      taskDiv.innerHTML = `
        <h3>${task.title}</h3>
        <p>🕒 Time: ${task.time}</p>
        <p>📅 Date: ${task.date}</p>
        <p>📁 Category: ${task.category}</p>
        <button class="complete-btn" data-index="${index}">✅ Complete</button>
      `;

      taskList.appendChild(taskDiv);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const time = document.getElementById("taskTime").value;
    const date = document.getElementById("taskDate").value;
    const category = document.getElementById("taskCategory").value;

    if (!title || !time || !date || !category) return;

    const newTask = {
      title,
      time,
      date,
      category,
      completed: false
    };

    const tasks = loadTasks();
    tasks.push(newTask);
    saveTasks(tasks);

    form.reset();
    renderTodayTasks();
  });

  taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("complete-btn")) {
      const taskIndex = parseInt(e.target.dataset.index);
      const tasks = loadTasks();

      const visibleTasks = tasks.filter(
        task => task.date === todayDate && !task.completed
      );

      const taskToComplete = visibleTasks[taskIndex];

      // Find the actual index in full list
      const trueIndex = tasks.findIndex(t =>
        t.title === taskToComplete.title &&
        t.date === taskToComplete.date &&
        t.time === taskToComplete.time &&
        t.category === taskToComplete.category
      );

      if (tasks[trueIndex].category === "Daily Routine") {
        alert("Daily Routine tasks can only be deleted manually.");
        return;
      }

      tasks[trueIndex].completed = true;
      saveTasks(tasks);
      renderTodayTasks();
    }
  });

  // Initial render
  renderTodayTasks();
});
