const minesTotal = 10;
const mines = [];
const buttons = [];
const rows = 10;
const cols = 10;
let buttonsDiv;

// Configure with input text number of cols, rows and total mines: Check how it is done by microsoft and google
// Move the mouse event check to a separate function
// Change win and game over alert for text on top of div
// Check browser compatibility

window.onload = () => {
    createMinesweeper();
}

function createMinesweeper() {
    createMines();
    createMainDiv();
    createButtons();
}

function createMines() {
    let count = 0;

    while (count < minesTotal) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);

        if (!isAMine(row, col)) {
            mines.push({row, col});
            count += 1;
        }
    }
}

function createMainDiv() {
    // Create div that will contain all buttons
    buttonsDiv = document.createElement('div');
    buttonsDiv.oncontextmenu = () => {
        return false;
    }
    buttonsDiv.style.width = '160px';
    buttonsDiv.style.height = '160px';
    buttonsDiv.style.background = 'grey';
    buttonsDiv.style.color = 'white';

    document.getElementById('minesweeper').appendChild(buttonsDiv);
}

function createButtons() {
    // Create all buttons
    for (let row = 0; row < rows; row++) {
        const rowButtons = [];
        for (let col = 0; col < cols; col++) {
            const button = document.createElement('button');
            button.style.width = '16px';
            button.style.height = '16px';
            button.style.display = 'inline';
            button.style.textAlign = 'center';
            button.style.color = 'black';
            button.style.fontSize = '12px';
            button.style.padding = '0px';
            button.onmouseup = (event) => {
                let isRightClick;
                if ("which" in event) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                    isRightClick = event.which === 3; 
                } else if ("button" in event) { // IE, Opera 
                    isRightClick = event.button === 2;
                }

                if (isRightClick) {
                    if (button.innerText === 'F') {
                        button.innerText = '';
                    } else {
                        button.innerText = 'F';
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
            
            buttonsDiv.appendChild(button);
            rowButtons.push(button);
        }
        buttons.push(rowButtons);
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
