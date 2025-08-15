document.addEventListener("DOMContentLoaded", () => {
  const modeSelection = document.querySelector(".mode-selection");
  const gameContainer = document.querySelector(".game-container");
  const multiplayerBtn = document.getElementById("multiplayer-btn");
  const aiBtn = document.getElementById("ai-btn");
  const boxes = document.querySelectorAll(".cell");
  const resetBtn = document.getElementById("reset-button");
  const homeBtn = document.getElementById("home-button");
  const newGameBtn = document.getElementById("new-button");
  const homeMsgBtn = document.getElementById("home-msg-button");
  const msgContainer = document.querySelector(".msg-container");
  const msg = document.querySelector("#msg");
  const gameModeTitle = document.getElementById("game-mode-title");

  let gameMode = "";
  let currentPlayer = 1; // 1 = Player 1, 2 = Player 2
  let totalMoves = 9;
  let gameActive = true;

  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function startGame(mode) {
    gameMode = mode;
    modeSelection.style.display = "none";
    gameContainer.style.display = "flex";
    gameModeTitle.textContent =
      mode === "multiplayer" ? "Multiplayer Duel - Player 1's Turn" : "Unbeatable AI Challenge";
    resetGame();
  }

  function returnToHome() {
    modeSelection.style.display = "block";
    gameContainer.style.display = "none";
    msgContainer.style.display = "none";
    resetGame();
  }

  function resetGame() {
    boxes.forEach((box) => {
      box.innerText = "";
      box.disabled = false;
      box.style.color = "#00ffe0"; 
    });
    currentPlayer = 1; // Reset to Player 1
    totalMoves = 9;
    gameActive = true;
    msgContainer.style.display = "none";
    if (gameMode === "multiplayer") {
      gameModeTitle.textContent = "Multiplayer Duel - Player 1's Turn";
    }
  }

  function handleBoxClick(box) {
    if (!gameActive || box.innerText !== "") return;

    if (gameMode === "multiplayer") {
      playMultiplayer(box);
    } else {
      playAgainstAI(box);
    }
  }

  function playMultiplayer(box) {
    if (currentPlayer === 1) {
      box.innerText = "X"; // Player 1
      box.style.color = "#60f1e0ff";
    } else {
      box.innerText = "O"; // Player 2
      box.style.color = "#ff4d6d";
    }

    box.disabled = true;
    totalMoves--;

    if (checkWinner(currentPlayer === 1 ? "X" : "O")) return;

    // Switch player
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    gameModeTitle.textContent = `Multiplayer Duel - Player ${currentPlayer}'s Turn`;
  }

  function playAgainstAI(box) {
    // Player's move
    box.innerText = "O";
    box.style.color = "#00ffe0";
    box.disabled = true;
    totalMoves--;

    if (checkWinner("O")) return;

    // AI move
    setTimeout(() => {
      const aiMove = getBestMove();
      if (aiMove !== undefined) {
        boxes[aiMove].innerText = "X";
        boxes[aiMove].style.color = "#ff4d6d";
        boxes[aiMove].disabled = true;
        totalMoves--;

        checkWinner("X");
      }
    }, 150);
  }

  function getBestMove() {
    let bestScore = -Infinity;
    let move;
    boxes.forEach((box, i) => {
      if (box.innerText === "") {
        box.innerText = "X";
        let score = minimax(boxes, 0, false);
        box.innerText = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    });
    return move;
  }

  function minimax(board, depth, isMaximizing) {
    const result = checkWinnerMinimax();
    if (result !== null) return result;

    if (isMaximizing) {
      let bestScore = -Infinity;
      board.forEach((box) => {
        if (box.innerText === "") {
          box.innerText = "X";
          let score = minimax(board, depth + 1, false);
          box.innerText = "";
          bestScore = Math.max(score, bestScore);
        }
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      board.forEach((box) => {
        if (box.innerText === "") {
          box.innerText = "O";
          let score = minimax(board, depth + 1, true);
          box.innerText = "";
          bestScore = Math.min(score, bestScore);
        }
      });
      return bestScore;
    }
  }

  function checkWinnerMinimax() {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      const line = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
      if (line.every((v) => v === "X")) return 10;
      if (line.every((v) => v === "O")) return -10;
    }
    const isFull = [...boxes].every((b) => b.innerText !== "");
    return isFull ? 0 : null;
  }

  function checkWinner(player) {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        boxes[a].innerText === player &&
        boxes[b].innerText === player &&
        boxes[c].innerText === player
      ) {
        showWinner(player);
        return true;
      }
    }
    if (totalMoves === 0) {
      showDraw();
      return true;
    }
    return false;
  }

  function showWinner(winner) {
    if (winner === "X" && gameMode === "multiplayer") msg.innerText = "Player 1 Wins!";
    else if (winner === "O" && gameMode === "multiplayer") msg.innerText = "Player 2 Wins!";
    else msg.innerText = "AI Wins!";
    msgContainer.style.display = "flex";
    gameActive = false;
  }

  function showDraw() {
    msg.innerText = "It's a Draw!";
    msgContainer.style.display = "flex";
    gameActive = false;
  }

  multiplayerBtn.addEventListener("click", () => startGame("multiplayer"));
  aiBtn.addEventListener("click", () => startGame("ai"));
  resetBtn.addEventListener("click", resetGame);
  homeBtn.addEventListener("click", returnToHome);
  newGameBtn.addEventListener("click", resetGame);
  homeMsgBtn.addEventListener("click", returnToHome);
  boxes.forEach((box) => box.addEventListener("click", () => handleBoxClick(box)));
});
