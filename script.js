import { WORDS } from "./words.js";

const gameArea = document.getElementById("gameArea");
const scoreBoard = document.getElementById("scoreBoard");
let secretWord = "";
let activeTimers = [];
let current_score = 0;

function gameStart() {
  current_score = getScore();
  secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  createGrid();
  scoreBoard.innerHTML = `<pre>Score:\n${current_score}</pre>`;
}

function getScore() {
  let score = localStorage.getItem("score");
  if (!score) {
    localStorage.setItem("score", "0");
    return 0;
  }
  return parseInt(score, 10);
}

function setScore() {
  current_score += 1;
  localStorage.setItem("score", current_score.toString());
  scoreBoard.innerHTML = `<pre>Score:\n${current_score}</pre>`;
}

function createGrid() {
  for (let i = 0; i < 6; i++) {
    const gameRow = document.createElement("div");
    gameRow.classList.add("gameRow");
    for (let j = 0; j < 5; j++) {
      const rowCell = document.createElement("div");
      rowCell.classList.add("rowCell");
      gameRow.appendChild(rowCell);
    }
    gameArea.appendChild(gameRow);
  }
}

gameStart();

function gameReset() {
  // 1. Clear timers and game state
  activeTimers.forEach((id) => clearTimeout(id));
  activeTimers = [];

  secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  currentRowIndex = 0;
  currentWord = "";
  currentCellIndex = 0;
  guesses = 0;
  isGameOver = false;

  // 2. Clear Grid
  const cells = document.querySelectorAll(".rowCell");
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.style.background = ""; // Reverts to CSS default (rgb(97, 97, 97))
    cell.style.borderColor = "";
    cell.classList.remove("winner");
  });

  // 3. Clear Keyboard Colors
  document.querySelectorAll(".key").forEach((key) => {
    key.classList.remove("correct", "present", "absent");
  });
}

document.getElementById("resetBtn").addEventListener("click", gameReset);
document.getElementById("resetBtn").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
});

let currentRowIndex = 0;
let currentWord = "";
let currentCellIndex = 0;
let guesses = 0;
let isGameOver = false;

function handleInput(key) {
  if (isGameOver) return;

  const rows = document.querySelectorAll(".gameRow");
  const currentRow = rows[currentRowIndex];
  const cells = currentRow.querySelectorAll(".rowCell");

  // 1. Handle Backspace
  if (key === "Backspace") {
    if (currentCellIndex > 0) {
      currentWord = currentWord.slice(0, -1);
      currentCellIndex--;
      cells[currentCellIndex].textContent = "";
    }
    return;
  }

  // 2. Handle Enter (Submit Guess)
  if (key === "Enter") {
    if (currentCellIndex === 5) {
      // Logic for word validation (Optional but recommended)
      if (!WORDS.includes(currentWord)) {
        alert("Not in word list!");
        return;
      }

      let { result, correct } = checkGuess();
      const guessToColor = currentWord; // Capture currentWord before we clear it

      // Staggered reveal of colors
      for (let i = 0; i < 5; i++) {
        const timerId = setTimeout(() => {
          cells[i].style.background = `${result[i]}`;
          cells[i].style.borderColor = `${result[i]}`;

          // Update corresponding keyboard key color
          updateKeyboardKey(guessToColor[i], result[i]);
        }, 200 * i);
        activeTimers.push(timerId);
      }

      currentWord = "";
      currentRowIndex++;
      currentCellIndex = 0;
      guesses += 1;

      if (correct == 5) {
        isGameOver = true;
        // Wait for all tiles to finish coloring before bouncing (200ms * 5 = 1000ms)
        setTimeout(() => winner(currentRowIndex - 1), 1200);
        return;
      }
      if (currentRowIndex === 6) {
        isGameOver = true;
        setTimeout(() => loser(), 1200);
        return;
      }
    } else {
      alert("Not enough letters!");
    }
    return;
  }

  // 3. Handle Letters (A-Z)
  if (key.length === 1 && key.match(/[a-z]/i)) {
    if (currentCellIndex < 5) {
      cells[currentCellIndex].textContent = key.toUpperCase();
      currentWord += key.toUpperCase();
      currentCellIndex++;
    }
  }
}

// Helper function to update virtual keyboard colors
function updateKeyboardKey(letter, color) {
  const keyElement = document.querySelector(
    `.key[data-key="${letter.toUpperCase()}"]`,
  );
  if (!keyElement) return;

  // Priority logic: Green > Yellow > Gray
  if (color === "#538d4e") {
    // Green
    keyElement.classList.remove("present", "absent");
    keyElement.classList.add("correct");
  } else if (color === "#b59f3b") {
    // Yellow
    if (!keyElement.classList.contains("correct")) {
      keyElement.classList.add("present");
    }
  } else {
    // Gray
    if (
      !keyElement.classList.contains("correct") &&
      !keyElement.classList.contains("present")
    ) {
      keyElement.classList.add("absent");
    }
  }
}

window.addEventListener("keydown", (e) => {
  handleInput(e.key);
});

function checkGuess() {
  let secretArr = secretWord.split("");
  let guessArr = currentWord.split("");
  let result = ["#3a3a3c", "#3a3a3c", "#3a3a3c", "#3a3a3c", "#3a3a3c"]; // Default Gray
  let correct = 0;
  // Pass 1: Find Greens
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = "#538d4e";
      secretArr[i] = null;
      guessArr[i] = null;
      correct++;
    }
  }

  // Pass 2: Find Yellows
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] !== null) {
      // Skip already green cells
      let index = secretArr.indexOf(guessArr[i]);
      if (index !== -1) {
        result[i] = "#b59f3b"; // Wordle Yellow
        secretArr[index] = null; // Mark as used
      }
    }
  }

  return { result, correct };
}

function winner(rowIndex) {
  setScore();
  const winningRow = document.querySelectorAll(".gameRow")[rowIndex];
  const winningCells = winningRow.querySelectorAll(".rowCell");
  winningCells.forEach((cell, i) => {
    const timerId = setTimeout(() => {
      cell.classList.add("winner");
    }, i * 100);

    activeTimers.push(timerId);

    cell.addEventListener(
      "animationend",
      () => {
        cell.classList.remove("winner");
      },
      { once: true },
    );
  });
}

function loser() {
  alert(`You Lost! The word was ${secretWord}`);
}

document.querySelectorAll(".key").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.getAttribute("data-key");
    handleInput(key);
    button.blur();
  });
});
