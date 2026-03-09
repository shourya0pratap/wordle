const gameArea = document.getElementById("game");

function gameStart() {
  for (let i = 0; i < 6; i++) {
    const gameRow = document.createElement("div");
    gameRow.classList.add("gameRow");
    for (let j = 0; j < 5; j++) {
      const rowCell = document.createElement("div");
      rowCell.classList.add("rowCell");
      gameRow.appendChild(rowCell);
    }
  }
}

gameStart();