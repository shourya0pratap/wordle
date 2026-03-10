import { WORDS } from "./words.js";

const gameArea = document.getElementById("gameArea");
let secretWord = "";

function gameStart() {
  secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
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

  // 2. Clear the UI
  const cells = document.querySelectorAll(".rowCell");
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.style.background = "rgb(97, 97, 97)";
    cell.style.color = "black";
  });

  console.log("Game Reset! New word selected.");
}

document.getElementById("resetBtn").addEventListener("click", gameReset);

let currentRowIndex = 0;
let currentWord = "";
let currentCellIndex = 0;
let guesses = 0;

function handleInput(key) {
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
      }
      currentWord = "";
      currentRowIndex++;
      currentCellIndex = 0;
      guesses += 1;
      if (correct == 5) {
        setTimeout(() => winner(), 500);
        return;
      }
      if (currentRowIndex === 6) {
        loser();
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

function winner() {
  alert("You Won!");
}

function loser() {
  alert(`You Lost! The word was ${secretWord}`);
}
