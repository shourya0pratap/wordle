import { WORDS } from "./words.js";

const gameArea = document.getElementById("gameArea");
let secretWord = "";
let activeTimers = [];

function gameStart() {
  secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  createGrid();
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
  // 1. Reset logic variables
  secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  currentRowIndex = 0;
  currentWord = "";
  currentCellIndex = 0;
  guesses = 0;
  isGameOver = false;
  activeTimers.forEach((id) => clearTimeout(id));
  activeTimers = [];

  // 2. Clear the UI by removing all children
  gameArea.innerHTML = "";

  // 3. Re-run the loop that builds the grid
  createGrid();

  console.log("Game Reset! All old listeners and styles purged.");
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
  if (isGameOver) {
    return;
  }

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
      let { result, correct } = checkGuess();
      for (let i = 0; i < 5; i++) {
        cells[i].style.background = `${result[i]}`;
        cells[i].style.borderColor = `${result[i]}`;
      }
      currentWord = "";
      currentRowIndex++;
      currentCellIndex = 0;
      guesses += 1;
      if (correct == 5) {
        isGameOver = true;
        setTimeout(() => winner(currentRowIndex - 1), 500);
        return;
      }
      if (currentRowIndex === 6) {
        isGameOver = true;
        setTimeout(() => loser(), 500);
        return;
      }
    } else {
      alert("Not enough letters!");
    }
    return;
  }

  // 3. Handle Letters (A-Z)
  // This Regex ensures only single letters are accepted
  if (key.length === 1 && key.match(/[a-z]/i)) {
    if (currentCellIndex < 5) {
      cells[currentCellIndex].textContent = key.toUpperCase();
      currentWord += key.toUpperCase();
      currentCellIndex++;
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
