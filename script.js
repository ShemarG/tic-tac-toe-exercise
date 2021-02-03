// Globals and initial vals

const board = document.getElementById('board');
const game = new TicTacToe(board);
let gameMatrix = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];
let player = 1;
let moveCount = 0;
let gameOver = [false, null];
const scoreboard = {
  round: 1,
  player1Wins: 0,
  player2Wins: 0,
  draws: 0
};
const playerObj = {
  1: ['player1Win', 'O'],
  2: ['player2Win', 'X']
};

// document element list
const gridBoxes = document.getElementsByClassName('column');
const nextButton = document.getElementById('nextButton');
nextButton.disabled = true;
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const draws = document.getElementById('draws');
const roundCounter = document.getElementById('roundCounter');
const playerIndicator = document.getElementById('playerIndicator');
const winnerText = document.getElementById('winnerText');

// Inital values
player1.textContent = `Player 1: ${scoreboard.player1Wins}`;
player2.textContent = `Player 2: ${scoreboard.player2Wins}`;
draws.textContent = `Draws: ${scoreboard.draws}`;
roundCounter.textContent = `Round: ${scoreboard.round}`;
playerIndicator.textContent = `Current Player: ${playerObj[player][1]}`;

for (let i = 0; i < gridBoxes.length; i++) {
  gridBoxes[i].addEventListener('click', getBox);
}

// Helper Functions

const rowCheck = (game, index) => {
  if (game[index][0] == game[index][1] && game[index][0] == game[index][2] && game[index][0] != 0) {
    return [true, ['row', index]];
  }
  return [false, null];
};

const colCheck = (game, index) => {
  if (game[0][index] == game[1][index] && game[0][index] == game[2][index] && game[0][index] != 0) {
    return [true, ['col', index]];
  }
  return [false, null];
};

const diagCheck = (game) => {
  if (game[0][0] == game[1][1] && game[0][0] == game[2][2] && game[0][0] != 0) {
    return [true, ['diag', 0]];
  } if (game[0][2] == game[1][1] && game[0][2] == game[2][0] && game[0][2] != 0) {
    return [true, ['diag', 2]];
  }
  return [false, null];
};

// this checks the matrix using the above 3 functions and returns a bool and the winning "position" (helps to display how a win was achieved)

const checkMatrix = (game) => {
  let winner;
  let winPos;
  winner = diagCheck(game)[0];
  if (winner == false) {
    for (let i = 0; i < game.length; i++) {
      winner = rowCheck(game, i)[0];
      if (winner === true) { winPos = rowCheck(game, i)[1]; break; }
      winner = colCheck(game, i)[0];
      if (winner === true) { winPos = colCheck(game, i)[1]; break; }
    }
  } else {
    winPos = diagCheck(game)[1];
  }
  if (winner === false) {
    return [false, null];
  }
  return [true, winPos];
};
// Helps to do some css when there is a win condition
const renderWin = (a) => {
  const newColl = [];
  if (a[0] == 'row') {
    for (var i = 0; i < gridBoxes.length; i++) {
      if (gridBoxes[i].parentElement.dataset.rowIndex == a[1]) {
        gridBoxes[i].classList.add(playerObj[`${player}`][0]);
      }
    }
  } else if (a[0] == 'col') {
    for (var i = 0; i < gridBoxes.length; i++) {
      if (gridBoxes[i].dataset.colIndex == a[1]) {
        gridBoxes[i].classList.add(playerObj[`${player}`][0]);
      }
    }
  } else if (a[1] == 0) {
    gridBoxes[0].classList.add(playerObj[`${player}`][0]);
    gridBoxes[4].classList.add(playerObj[`${player}`][0]);
    gridBoxes[8].classList.add(playerObj[`${player}`][0]);
  } else {
    gridBoxes[2].classList.add(playerObj[`${player}`][0]);
    gridBoxes[4].classList.add(playerObj[`${player}`][0]);
    gridBoxes[6].classList.add(playerObj[`${player}`][0]);
  }
};

// Does what it says on the tin
const reset = () => {
  gameMatrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  for (let i = 0; i < gridBoxes.length; i++) {
    gridBoxes[i].innerHTML = '';
    gridBoxes[i].classList.remove('player1Win');
    gridBoxes[i].classList.remove('player2Win');
  }
  moveCount = 0;
  if (gameOver[0] == true) {
    roundCounter.textContent = `Round: ${scoreboard.round}`;
  }
  gameOver = [false, null];
  nextButton.disabled = true;
  resetButton.disabled = false;
  winnerText.textContent = '';
};

nextButton.addEventListener('click', reset);
resetButton.addEventListener('click', reset);

// This is the main function that fills in spaces and checks for wins/draws
function getBox() {
  const pos = [parseInt(this.parentElement.getAttribute('data-row-index')), parseInt(this.getAttribute('data-col-index'))];

  if (gameMatrix[pos[0]][pos[1]] == 0 && gameOver[0] == false) {
    if (player == 1) {
      gameMatrix[pos[0]][pos[1]] = 'O';
      this.innerHTML = 'O';
    } else {
      gameMatrix[pos[0]][pos[1]] = 'X';
      this.innerHTML = 'X';
    }
    gameOver = checkMatrix(gameMatrix);

    if (gameOver[0] == true) {
      renderWin(gameOver[1]);
      winnerText.textContent = `PLAYER ${player} WINS !!!`;
      winnerText.classList.add(playerObj[`${player}`][0]);
      scoreboard[`player${player}Wins`]++;
      scoreboard.round++;
      resetButton.disabled = true;
      nextButton.disabled = false;
      player1.textContent = `Player 1: ${scoreboard.player1Wins}`;
      player2.textContent = `Player 2: ${scoreboard.player2Wins}`;
    }
    player == 1 ? player = 2 : player = 1;
    playerIndicator.textContent = `Current Player: ${playerObj[player][1]}`;
    moveCount++;

    if (moveCount == 9 && gameOver[0] == false) {
      scoreboard.draws++;
      nextButton.disabled = false;
      draws.textContent = `Draws: ${scoreboard.draws}`;
    }
  }
}
