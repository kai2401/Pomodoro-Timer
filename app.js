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
  updateProgress();
}

function pauseTimer() {
  if (!isRunning) {
    return;
  }

  clearInterval(timerHandle);
  timerHandle = null;
  isRunning = false;
  updateProgress();
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
  updateDisplay(false);
}

function updateDisplay(animateProgress = isRunning) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  document.getElementById("time-display").textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  document.getElementById("phase-label").textContent =
    currentPhase === "work" ? "Work" : "Break";
  updateProgress(animateProgress);
}

function updateProgress(animate = isRunning) {
  const progressCircle = document.getElementById("progress-ring");
  const progressBar = document.getElementById("timer-progress");
  const duration =
    currentPhase === "work" ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS;
  const circumference = 2 * Math.PI * Number(progressCircle.getAttribute("r"));
  const progress = remainingSeconds / duration;

  progressCircle.style.strokeDasharray = String(circumference);
  progressCircle.style.strokeDashoffset = String(circumference * (1 - progress));
  progressCircle.style.transitionDuration = animate ? "1s" : "0s";
  progressBar.setAttribute("aria-valuemax", String(duration));
  progressBar.setAttribute("aria-valuenow", String(remainingSeconds));
}

function playPhaseSound() {}

function loadCompletedSessions() {}

function saveCompletedSessions(count) {}

function updateSessionCount() {}

document.getElementById("start-button").addEventListener("click", startTimer);
document.getElementById("pause-button").addEventListener("click", pauseTimer);
document.getElementById("reset-button").addEventListener("click", resetTimer);
updateDisplay();
