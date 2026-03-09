import { WORDS } from "./words.js";
const gameArea = document.getElementById("gameArea");

function gameStart() {
  const secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
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
  const secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
}

let currentRowIndex = 0;

function handleInput(letter) {
  const rows = document.querySelectorAll(".gameRow");
  const currentRow = rows[currentRowIndex];
  const cells = currentRow.querySelectorAll(".rowCell");
}

gameArea.addEventListener("click", (e) => {});
