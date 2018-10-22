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
        mines: 40
    },
    'hard': {
        rows: 24,
        cols: 20,
        mines: 99,
    }
}

// Change win and game over alert for text on top of div
// Check browser compatibility

window.onload = () => {
    loadComponents();
    document.getElementById('test').onclick = (event) => {
        console.log('you clicked the div');
    };
}

function loadComponents() {
    createDifficultyDropdown();
    setValues();
    createMinesweeper();
}

function setValues() {
    minesTotal = difficulties[difficulty].mines;
    rows = difficulties[difficulty].rows;
    cols = difficulties[difficulty].cols;
}

function createDifficultyDropdown() {
    const div = document.createElement('div');
    
    const easy = document.createElement('option');
    easy.value = 'easy';
    easy.innerText = 'Easy';

    const medium = document.createElement('option');
    medium.value = 'medium';
    medium.innerText = 'Medium';

    const hard = document.createElement('option');
    hard.value = 'hard';
    hard.innerText = 'Hard';
    
    const select = document.createElement('select');
    select.onchange = () => {
        console.log('creating new minesweeper');
        difficulty = select.value;
        setValues();
        createMinesweeper();
    }
    select.appendChild(easy);
    select.appendChild(medium);
    select.appendChild(hard);

    div.appendChild(select);

    document.getElementById('minesweeper').appendChild(div);
}

function createMinesweeper() {
    createMines();
    createMainDiv();
    createButtons();
}

function createMines() {
    mines = [];
    let count = 0;

    while (count < minesTotal) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        if (!isAMine(row, col)) {
            mines.push({row, col});
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
    buttonsDiv.style.width = (cols * cellWidth) + 'px';
    buttonsDiv.style.height = (rows * cellHeight) + 'px';
    buttonsDiv.style.background = 'grey';
    buttonsDiv.style.color = 'white';

    document.getElementById('minesweeper').appendChild(buttonsDiv);
}

function createButtons() {
    buttons = [];
    const buttonsDiv = document.getElementById('buttonsDiv');

    for (let row = 0; row < rows; row++) {
        const rowButtons = [];
        for (let col = 0; col < cols; col++) {
            const button = document.createElement('button');
            button.style.width = cellWidth + 'px';
            button.style.height = cellHeight + 'px';
            button.style.display = 'inline';
            button.style.textAlign = 'center';
            button.style.margin = 'auto';
            button.style.color = 'black';
            button.style.fontSize = '12px';
            button.style.padding = '0px';
            button.onmouseup = (event) => onMouseClick(event, button, row, col);            
            buttonsDiv.appendChild(button);
            rowButtons.push(button);
        }
        buttons.push(rowButtons);
    }
}

function onMouseClick(event, button, row, col) {
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
            alert('BOOM');
            revealMines();
            disableAllButtons();
        } else {
            revealSquare(row, col);
            checkWin();
        }
    }
}

function revealSquare(row, col) {
    if (row < 0 || col < 0) return;
    if (row >= rows || col >= cols) return;    
    if (buttons[row][col].disabled) return;        
    if (isAMine(row, col)) return;

    const minesAround = countMinesAround(row, col);

    if (minesAround > 0) {
        buttons[row][col].innerText = minesAround;
        buttons[row][col].disabled = true;
        return;
    }

    buttons[row][col].disabled = true;
    buttons[row][col].style.backgroundColor = 'grey';

    revealSquare(row - 1, col - 1);
    revealSquare(row - 1, col);
    revealSquare(row - 1, col + 1);
    revealSquare(row, col - 1);
    revealSquare(row, col + 1);
    revealSquare(row + 1, col - 1);
    revealSquare(row + 1, col);
    revealSquare(row + 1, col + 1);
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
    mines.forEach(mine => {
        buttons[mine.row][mine.col].disabled = true;
        buttons[mine.row][mine.col].innerText = 'X';
        buttons[mine.row][mine.col].style.color = 'red';
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

function checkWin() {
    let countDisabled = 0;
    buttons.forEach(row => {
        row.forEach(button => {
            if (button.disabled) {
                countDisabled++;
            }
        })
    })

    console.log(countDisabled);

    if (countDisabled === (rows * cols - minesTotal)) {
        disableAllButtons();
        alert('Winner');
    }
}
