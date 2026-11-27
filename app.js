const WORK_DURATION_SECONDS = 25 * 60;
const BREAK_DURATION_SECONDS = 5 * 60;

let timerHandle = null;
let currentPhase = "work";
let remainingSeconds = WORK_DURATION_SECONDS;
let isRunning = false;
let completedSessions = 0;

function init() {}

function startTimer() {
  if (isRunning || remainingSeconds <= 0) {
    return;
  }

  isRunning = true;
  timerHandle = setInterval(tick, 1000);
}

function pauseTimer() {
  if (!isRunning) {
    return;
  }

  clearInterval(timerHandle);
  timerHandle = null;
  isRunning = false;
}

function resumeTimer() {
  startTimer();
}

function resetTimer() {
  clearInterval(timerHandle);
  timerHandle = null;
  isRunning = false;
  currentPhase = "work";
  remainingSeconds = WORK_DURATION_SECONDS;
  updateDisplay();
}

function tick() {
  if (remainingSeconds > 0) {
    remainingSeconds -= 1;
  }

  updateDisplay();

  if (remainingSeconds === 0) {
    switchPhase();
  }
}

function switchPhase() {
  currentPhase = currentPhase === "work" ? "break" : "work";
  remainingSeconds =
    currentPhase === "work" ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS;
  updateDisplay();
}

function updateDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  document.getElementById("time-display").textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  document.getElementById("phase-label").textContent =
    currentPhase === "work" ? "Work" : "Break";
}

function updateProgress() {}

function playPhaseSound() {}

function loadCompletedSessions() {}

function saveCompletedSessions(count) {}

function updateSessionCount() {}

document.getElementById("start-button").addEventListener("click", startTimer);
document.getElementById("pause-button").addEventListener("click", pauseTimer);
document.getElementById("reset-button").addEventListener("click", resetTimer);
