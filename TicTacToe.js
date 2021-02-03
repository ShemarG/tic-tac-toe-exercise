class TicTacToe {
  constructor(board) {
    this.board = board;
    this.matrix = [[], [], []];
    this.sessionHistory = {};
    this.moves = [];
    this.round = 1;
    this.winner = null;
    this.moveCount = 0;
    this.currentPlayer = 'O';
    this.buildTitle();
    this.buildStatusHUD();
    this.buildGrid();
    this.buildScoreboard();
  }

  buildStatusHUD() {
    // Top Level
    const statusHUD = document.createElement('div');
    statusHUD.classList.add('status-hud');
    // Round Count Span
    const roundCounterSpan = document.createElement('span');
    roundCounterSpan.classList.add('hud-item');
    const roundText = document.createElement('p');
    roundText.textContent = 'Round:';
    roundCounterSpan.appendChild(roundText);
    const roundCounter = document.createElement('span');
    roundCounter.classList.add('counter');
    roundCounter.textContent = this.round;
    this.roundCounter = roundCounter;
    roundCounterSpan.appendChild(roundCounter);
    statusHUD.appendChild(roundCounterSpan);

    // Current Player Span
    const currentPlayerSpan = document.createElement('span');
    currentPlayerSpan.classList.add('hud-item');
    const playerText = document.createElement('p');
    playerText.textContent = 'Current Player:';
    currentPlayerSpan.appendChild(playerText);
    const playerStatus = document.createElement('span');
    playerStatus.classList.add('counter');
    playerStatus.textContent = this.currentPlayer;
    this.playerStatus = playerStatus;
    currentPlayerSpan.appendChild(playerStatus);
    statusHUD.appendChild(currentPlayerSpan);
    this.board.appendChild(statusHUD);
  }

  buildGrid() {
    const gridArea = document.createElement('div');
    this.elMatrix = [[], [], []];
    gridArea.classList.add('grid-area');
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const gridBox = document.createElement('div');
        gridBox.classList.add('grid-boxes');
        gridBox.dataset.row = i;
        gridBox.dataset.column = j;
        gridBox.addEventListener('click', this.checkBox.bind(this));
        this.elMatrix[i][j] = gridBox;
        gridArea.appendChild(gridBox);
      }
    }
    // For that classic look.
    Object.assign(this.elMatrix[0][0].style, { borderTop: '0', borderLeft: '0' });
    Object.assign(this.elMatrix[0][2].style, { borderTop: '0', borderRight: '0' });
    Object.assign(this.elMatrix[2][0].style, { borderBottom: '0', borderLeft: '0' });
    Object.assign(this.elMatrix[2][2].style, { borderBottom: '0', borderRight: '0' });
    this.elMatrix[0][1].style.borderTop = '0';
    this.elMatrix[1][0].style.borderLeft = '0';
    this.elMatrix[1][2].style.borderRight = '0';
    this.elMatrix[2][1].style.borderBottom = '0';
    this.board.appendChild(gridArea);
  }

  buildScoreboard() {
    const scoreboard = document.createElement('div');
    const counterWrapper = document.createElement('div');
    counterWrapper.classList.add('counter-wrapper');
    scoreboard.classList.add('scoreboard');
    const oSpan = document.createElement('span');
    oSpan.classList.add('scoreboard-item');
    const oSpanText = document.createElement('p');
    oSpanText.textContent = '"O" Wins:';
    oSpan.appendChild(oSpanText);
    const oWins = document.createElement('span');
    oWins.classList.add('counter');
    this.oWins = 0;
    this.oWinsCounter = oWins;
    oWins.textContent = this.oWins;
    oSpan.appendChild(oWins);
    counterWrapper.appendChild(oSpan);

    const xSpan = document.createElement('span');
    xSpan.classList.add('scoreboard-item');
    const xSpanText = document.createElement('p');
    xSpanText.textContent = '"X" Wins:';
    xSpan.appendChild(xSpanText);
    const xWins = document.createElement('span');
    xWins.classList.add('counter');
    this.xWins = 0;
    this.xWinsCounter = xWins;
    xWins.textContent = this.xWins;
    xSpan.appendChild(xWins);
    counterWrapper.appendChild(xSpan);

    const drawSpan = document.createElement('span');
    drawSpan.classList.add('scoreboard-item');
    const drawSpanText = document.createElement('p');
    drawSpanText.textContent = 'Draws:';
    drawSpan.appendChild(drawSpanText);
    const draws = document.createElement('span');
    draws.classList.add('counter');
    this.draws = 0;
    this.drawsCounter = draws;
    draws.textContent = this.draws;
    drawSpan.appendChild(draws);
    counterWrapper.appendChild(drawSpan);

    const buttonMenu = document.createElement('div');
    buttonMenu.classList.add('button-menu');

    const resetButton = document.createElement('button');
    resetButton.classList.add('menu-button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', this.reset.bind(this));
    this.action = resetButton;
    buttonMenu.appendChild(resetButton);

    const replayButton = document.createElement('button');
    replayButton.classList.add('menu-button');
    replayButton.textContent = 'Show Previous Rounds';
    replayButton.addEventListener('click', this.showPreviousRounds.bind(this));
    this.replayButton = replayButton;
    this.replayButton.disabled = !(this.round > 1);
    buttonMenu.appendChild(replayButton);

    const replayList = document.createElement('div');
    replayList.classList.add('replay-list');
    this.replayList = replayList;

    scoreboard.appendChild(counterWrapper);
    scoreboard.appendChild(buttonMenu);
    scoreboard.appendChild(replayList);
    this.board.appendChild(scoreboard);
  }

  buildTitle() {
    const titleContainer = document.createElement('span');
    const title = document.createElement('h1');
    title.style.margin = '0';
    title.textContent = 'TIC-TAC-TOE: Redux';
    titleContainer.appendChild(title);
    this.board.appendChild(titleContainer);
  }

  checkBox(e) {
    const box = e.currentTarget;
    const { row } = box.dataset;
    const { column } = box.dataset;
    if (this.matrix[row][column] === undefined) {
      this.matrix[row][column] = this.currentPlayer;
    } else { return; }
    if (this.winner !== null && this.moveCount < 9) return;
    const img = document.createElement('img');
    img.src = this.currentPlayer === 'O' ? 'o.svg' : 'x.png';
    img.style.width = '80%';
    box.appendChild(img);
    this.moveCount += 1;
    this.moves.push({ player: this.currentPlayer, coords: { row, column } });
    this.checkWin();
    this.currentPlayer = this.currentPlayer === 'O' ? 'X' : 'O';
    this.updatePlayer();
  }

  checkWin() {
    if (this.matrix[0][0] === this.matrix[0][1]
      && this.matrix[0][0] === this.matrix[0][2]
      && this.matrix[0][0] !== undefined) {
      this.renderWinner(this.elMatrix[0][0], this.elMatrix[0][1], this.elMatrix[0][2]);
    } else if (this.matrix[1][0] === this.matrix[1][1]
      && this.matrix[1][0] === this.matrix[1][2]
      && this.matrix[1][0] !== undefined) {
      this.renderWinner(this.elMatrix[1][0], this.elMatrix[1][1], this.elMatrix[1][2]);
    } else if (this.matrix[2][0] === this.matrix[2][1]
      && this.matrix[2][0] === this.matrix[2][2]
      && this.matrix[2][0] !== undefined) {
      this.renderWinner(this.elMatrix[2][0], this.elMatrix[2][1], this.elMatrix[2][2]);
    } else if (this.matrix[0][0] === this.matrix[1][0]
      && this.matrix[0][0] === this.matrix[2][0]
      && this.matrix[0][0] !== undefined) {
      this.renderWinner(this.elMatrix[0][0], this.elMatrix[1][0], this.elMatrix[2][0]);
    } else if (this.matrix[0][1] === this.matrix[1][1]
      && this.matrix[0][1] === this.matrix[2][1]
      && this.matrix[0][1] !== undefined) {
      this.renderWinner(this.elMatrix[0][1], this.elMatrix[1][1], this.elMatrix[2][1]);
    } else if (this.matrix[0][2] === this.matrix[1][2]
      && this.matrix[0][2] === this.matrix[2][2]
      && this.matrix[0][2] !== undefined) {
      this.renderWinner(this.elMatrix[0][2], this.elMatrix[1][2], this.elMatrix[2][2]);
    } else if (this.matrix[0][0] === this.matrix[1][1]
      && this.matrix[0][0] === this.matrix[2][2]
      && this.matrix[0][0] !== undefined) {
      this.renderWinner(this.elMatrix[0][0], this.elMatrix[1][1], this.elMatrix[2][2]);
    } else if (this.matrix[0][2] === this.matrix[1][1]
      && this.matrix[0][2] === this.matrix[2][0]
      && this.matrix[0][2] !== undefined) {
      this.renderWinner(this.elMatrix[0][2], this.elMatrix[1][1], this.elMatrix[2][0]);
    }
    if (this.moveCount === 9 && this.winner === null) {
      this.winner = 'Draw';
      this.draws += 1;
      this.updateCounters();
      this.gameEnd();
    }
  }

  clearBoard() {
    const boxes = this.board.getElementsByClassName('grid-boxes');
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].innerHTML = '';
      boxes[i].classList.remove('win');
    }
  }

  gameEnd() {
    this.sessionHistory[this.round] = { round: this.round, winner: this.winner, moves: this.moves };
    const span = document.createElement('span');
    span.classList.add('replay-list-item');
    span.textContent = `Round: ${this.round}, Winner: ${this.winner}`;
    this.replayList.appendChild(span);
    this.action.textContent = 'Next Round';
  }

  renderWinner(el1, el2, el3) {
    el1.classList.add('win');
    el2.classList.add('win');
    el3.classList.add('win');
    this.winner = this.currentPlayer;
    if (this.winner === 'O') {
      this.oWins += 1;
    } else {
      this.xWins += 1;
    }
    this.updateCounters();
    this.gameEnd();
  }

  reset() {
    if (this.action.textContent === 'Next Round') {
      this.round += 1;
    }
    this.winner = null;
    this.moveCount = 0;
    this.moves = [];
    this.matrix = [[], [], []];
    this.clearBoard();
    this.updateCounters();
    this.action.textContent = 'Reset';
    this.replayButton.disabled = !(this.round > 1);
  }

  showPreviousRounds() {
    this.action.disabled = true;
    if (this.replayButton.textContent === 'Show Previous Rounds') {
      this.replayButton.textContent = 'Back to Game';
    }
  }

  updateCounters() {
    this.roundCounter.textContent = this.round;
    this.oWinsCounter.textContent = this.oWins;
    this.xWinsCounter.textContent = this.xWins;
    this.drawsCounter.textContent = this.draws;
  }

  updatePlayer() {
    this.playerStatus.textContent = this.currentPlayer;
  }
}
