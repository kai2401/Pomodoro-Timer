const WORK_DURATION_SECONDS = 25 * 60;
const BREAK_DURATION_SECONDS = 5 * 60;

let timerHandle = null;
let currentPhase = "work";
let remainingSeconds = WORK_DURATION_SECONDS;
let isRunning = false;
let completedSessions = 0;
let audioContext = null;

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
  playPhaseSound();
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

function playPhaseSound() {
  playTone(currentPhase === "break" ? 660 : 880, 0.2);
}

function playButtonSound() {
  playTone(440, 0.1);
}

function playTone(frequency, duration) {
  if (!audioContext) {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      console.error("Web Audio API is not supported in this browser.");
      return;
    }

    audioContext = new AudioContextConstructor();
  }

  const play = () => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startTime = audioContext.currentTime;

    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  if (audioContext.state === "suspended") {
    audioContext.resume().then(play);
  } else {
    play();
  }
}

function loadCompletedSessions() {}

function saveCompletedSessions(count) {}

function updateSessionCount() {}

document.getElementById("start-button").addEventListener("click", () => {
  playButtonSound();
  startTimer();
});
document.getElementById("pause-button").addEventListener("click", () => {
  playButtonSound();
  pauseTimer();
});
document.getElementById("reset-button").addEventListener("click", () => {
  playButtonSound();
  resetTimer();
});
updateDisplay();
