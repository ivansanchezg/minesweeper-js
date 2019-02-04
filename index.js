let minesTotal = 10;
let mines = [];
let buttons = [];
let rows = 9;
let cols = 9;
let buttonsDiv;
let difficulty = 'easy';
const cellWidth = 16;
const cellHeight = 16;

const difficulties = {
  'easy': {
    rows: 9,
    cols: 9,
    mines: 10,
  },
  'medium': {
    rows: 16,
    cols: 16,
    mines: 40,
  },
  'hard': {
    rows: 24,
    cols: 20,
    mines: 99,
  }
}

window.onload = () => {
  loadComponents();
}

function loadComponents() {
  createTopBar();
  setValues();
  createMinesweeper();
}

function setValues() {
  minesTotal = difficulties[difficulty].mines;
  rows = difficulties[difficulty].rows;
  cols = difficulties[difficulty].cols;
}

function createTopBar() {
  const topBar = document.createElement('div');
  topBar.style.display = 'inline-block';

  const topPanel = document.createElement('div');
  topPanel.style.display = 'block';
  topPanel.style.paddingBottom = '4px';

  const newGame = document.createElement('button');
  newGame.style.display = 'inline';
  newGame.innerText = 'New game';
  newGame.onmouseup = () => {
    createMinesweeper();
  }

  const message = document.createElement('div');
  message.id = 'minesweeper-message';
  message.style.paddingLeft = '10px';
  message.style.display = 'inline';

  topPanel.appendChild(newGame);
  topPanel.appendChild(message);

  const midPanel = document.createElement('div');
  midPanel.style.display = 'block';
  midPanel.style.paddingBottom = '4px';

  const easy = document.createElement('option');
  easy.value = 'easy';
  easy.innerText = 'Easy';

  const medium = document.createElement('option');
  medium.value = 'medium';
  medium.innerText = 'Medium';

  const hard = document.createElement('option');
  hard.value = 'hard';
  hard.innerText = 'Hard';

  const minesCount = document.createElement('div');
  minesCount.style.display = 'inline';
  minesCount.style.paddingLeft = '10px';
  minesCount.innerText = 'Mines: ' + minesTotal;

  const select = document.createElement('select');
  select.style.display = 'inline';
  select.onchange = () => {
    difficulty = select.value;
    setValues();
    createMinesweeper();
    minesCount.innerText = 'Mines: ' + minesTotal;
  }
  select.appendChild(easy);
  select.appendChild(medium);
  select.appendChild(hard);

  midPanel.appendChild(select);
  midPanel.appendChild(minesCount);

  const bottomPanel = document.createElement('div');
  bottomPanel.style.display = 'block';
  bottomPanel.style.paddingBottom = '4px';
  bottomPanel.style.fontSize = '12px';
  bottomPanel.innerText = 'Left click to open a cell.\nRight click to set a flag.';

  topBar.appendChild(topPanel);
  topBar.appendChild(midPanel);
  topBar.appendChild(bottomPanel);

  document.getElementById('minesweeper').appendChild(topBar);
}

function createMinesweeper() {
  createMines();
  createMainDiv();
  createButtons();
  setMessage('', 'black');
}

function createMines() {
  mines = [];
  let count = 0;

  while (count < minesTotal) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (!isAMine(row, col)) {
      mines.push({ row, col });
      count += 1;
    }
  }
}

function createMainDiv() {
  const checkButtonsDiv = document.getElementById('buttonsDiv');
  if (checkButtonsDiv) {
    document.getElementById('minesweeper').removeChild(checkButtonsDiv);
  }

  // Create div that will contain all buttons
  const buttonsDiv = document.createElement('div');
  buttonsDiv.id = 'buttonsDiv';
  buttonsDiv.oncontextmenu = () => {
    return false;
  }
  buttonsDiv.style.width = (cols * cellWidth) + (cols * 2) + 1 + 'px';
  buttonsDiv.style.height = (rows * cellHeight) + (rows * 2) + 1 + 'px';
  buttonsDiv.style.textAlign = 'center';

  document.getElementById('minesweeper').appendChild(buttonsDiv);
}

function createButtons() {
  buttons = [];
  const buttonsDiv = document.getElementById('buttonsDiv');

  for (let row = 0; row < rows; row++) {
    const rowButtons = [];
    for (let col = 0; col < cols; col++) {
      const button = document.createElement('div');
      button.style.width = cellWidth + 'px';
      button.style.height = cellHeight + 'px';
      button.style.display = 'inline-block';
      button.style.textAlign = 'center';
      button.style.margin = 'auto';
      button.style.color = 'white';
      button.style.fontSize = '14px';
      button.style.padding = '0';
      button.style.backgroundColor = '#cccccc';
      button.style.border = '1px solid black';
      button.style.verticalAlign = 'top';
      button.style.cssFloat = 'left';
      button.onmouseup = (event) => onMouseClick(event, button, row, col);
      buttonsDiv.appendChild(button);
      rowButtons.push(button);
    }
    buttons.push(rowButtons);
  }
}

function onMouseClick(event, button, row, col) {
  if (button.disabled) return;

  let isRightClick;
  if ("which" in event) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
    isRightClick = event.which === 3;
  } else if ("button" in event) { // IE, Opera 
    isRightClick = event.button === 2;
  }

  if (isRightClick) {
    if (button.innerText === 'F') {
      button.innerText = '';
      button.style.color = 'black';
    } else {
      button.innerText = 'F';
      button.style.color = 'blue';
    }
  } else {
    if (button.innerText === 'F') return;

    if (isAMine(row, col)) {
      setMessage('You lose!', 'red');
      revealMines();
      disableAllButtons();
    } else {
      revealCell(row, col);
      checkWin();
    }
  }
}

function revealCell(row, col) {
  if (row < 0 || col < 0) return;
  if (row >= rows || col >= cols) return;
  if (buttons[row][col].disabled) return;
  if (isAMine(row, col)) return;

  const minesAround = countMinesAround(row, col);
  buttons[row][col].disabled = true;
  buttons[row][col].style.backgroundColor = '#999999';

  if (minesAround > 0) {
    buttons[row][col].innerText = minesAround;
    return;
  }
  
  revealCell(row - 1, col - 1);
  revealCell(row - 1, col);
  revealCell(row - 1, col + 1);
  revealCell(row, col - 1);
  revealCell(row, col + 1);
  revealCell(row + 1, col - 1);
  revealCell(row + 1, col);
  revealCell(row + 1, col + 1);
}

function countMinesAround(row, col) {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i < 0 || i > rows) {
        break;
      }
      if (j < 0 || j > cols) {
        continue;
      }
      if (isAMine(i, j)) {
        count++;
      }
    }
  }
  return count;
}

function revealMines() {
  mines.forEach((mine) => {
    buttons[mine.row][mine.col].disabled = true;
    buttons[mine.row][mine.col].style.backgroundColor = 'red';
    buttons[mine.row][mine.col].innerText = 'X';
    buttons[mine.row][mine.col].style.color = 'white';
  });
}

function isAMine(row, col) {
  const isMine = mines.find(mine => mine.row == row && mine.col == col);
  return isMine ? true : false;
}

function disableAllButtons() {
  buttons.forEach(row => {
    row.forEach(button => {
      button.disabled = true;
    })
  })
}

function setMessage(message, color) {
  const minesweeperMessage = document.getElementById('minesweeper-message');
  minesweeperMessage.innerText = message;
  minesweeperMessage.style.color = color;
}

function checkWin() {
  let countDisabled = 0;
  buttons.forEach(row => {
    row.forEach(button => {
      if (button.disabled) {
        countDisabled++;
      }
    })
  })

  if (countDisabled === (rows * cols - minesTotal)) {
    disableAllButtons();
    setMessage('You win!', 'green');
  }
}
