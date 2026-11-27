
# Pomodoro Web App Development Plan

## Goal and behavior

Build a browser-based Pomodoro timer using only `index.html`, `style.css`, and `app.js`. The timer alternates automatically between 25-minute work phases and 5-minute breaks. Users can start, pause, resume, and reset. Show a circular countdown/progress indicator, play a sound on phase changes, and persist the completed-work-session count in `localStorage`.

Assumptions confirmed: count one session when a work phase completes; Reset returns to a fresh work phase and preserves the saved count. Starting a phase timer automatically after a phase transition fulfills automatic switching.

## File responsibilities

- **`index.html`** — Semantic page structure: phase label, time display, circular progress element (SVG or CSS-based), accessible timer controls, and completed-session count. Link `style.css` and load `app.js` with `defer`.
- **`style.css`** — Layout, responsive presentation, phase-specific styling, circular progress visuals, and visible focus/disabled states.
- **`app.js`** — Timer state and interval lifecycle, phase transitions, display/progress updates, button behavior, phase-change sounds, and loading/saving the completed count.

## Suggested JavaScript signatures

```js
function init(): void
function startTimer(): void
function pauseTimer(): void
function resumeTimer(): void
function resetTimer(): void
function tick(): void
function switchPhase(): void
function updateDisplay(): void
function updateProgress(): void
function playPhaseSound(): void
function loadCompletedSessions(): number
function saveCompletedSessions(count: number): void
function updateSessionCount(): void
```

Keep a single timer handle and explicit state for the current phase, remaining seconds, and running/paused status. Clear the interval on pause, reset, and phase transition to prevent duplicate timers. Update the count and persist it only when work completes. Guard `localStorage` parsing so invalid stored values do not break initialization; use the browser's audio capability without adding another file or dependency.

## Feature-by-feature implementation order

1. **HTML structure** — Add the three-file wiring, timer/phase/count display, progress element, and controls with stable IDs and accessible labels.
2. **Static styling** — Establish the layout and style the circular progress indicator and phase states.
3. **State and initialization** — Define phase durations and timer state; implement `init()`, storage loading, initial rendering, and event-handler wiring.
4. **Countdown and controls** — Implement `tick()`, `startTimer()`, `pauseTimer()`, `resumeTimer()`, and `resetTimer()`; verify no duplicate intervals and that reset returns to work without changing the saved count.
5. **Progress and phase transitions** — Implement `updateProgress()` and `switchPhase()`; on work completion, increment/persist the count, then automatically begin the break; on break completion, automatically begin work.
6. **Verification** — Check work/break durations, each control, repeated transitions, circular progress at start and end, sound on both transition directions, and count persistence across reloads.

6. **Sounds and finish-state polish** — Implement `playPhaseSound()` with different sounds for work-to-break and break-to-work transitions. Add a short beep whenever the Start, Pause or Reset button is pressed to allow immediate sound testing. Ensure audio activation follows browser interaction policies.

## Scope boundary

Do not add files, frameworks, dependencies, backend services, or unrelated features.
