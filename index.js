const minesTotal = 10;
const mines = [];
const buttons = [];
let mainDiv;

window.onload = () => {
    createMinesweeper();
}

window.oncontextmenu = function ()
{
    // showCustomMenu();
    return false;     // cancel default menu
}

function createMinesweeper() {
    createMines();
    createMainDiv();
    createButtons();
}

function createMainDiv() {
    // Create div that will contain all buttons
    mainDiv = document.createElement('div');
    mainDiv.style.width = '160px';
    mainDiv.style.height = '160px';
    mainDiv.style.background = 'grey';
    mainDiv.style.color = 'white';

    document.getElementById('minesweeper').appendChild(mainDiv);
}

function createButtons() {
    // Create all buttons
    for (let row = 0; row < 10; row++) {
        const rowButtons = [];
        for (let col = 0; col < 10; col++) {
            const button = document.createElement('button');
            button.style.width = '16px';
            button.style.height = '16px';
            button.style.display = 'inline';
            button.style.textAlign = 'center';
            button.style.color = 'black';
            button.onmouseup = (event) => {
                console.dir(event);

                let isRightClick;
                if ("which" in event) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                    isRightClick = event.which === 3; 
                }
                else if ("button" in event) { // IE, Opera 
                    isRightClick = event.button === 2;
                }                

                console.log("Right mouse button " + (isRightClick ? "" : "was not ") + "clicked!");

                if (isAMine(row, col)) {
                    // Game Over
                    alert('BOOM');
                    revealMines();
                }

                if (isRightClick) {
                    button.innerText = 'F';
                } else {
                    button.disabled = true;
                }
            }
            
            mainDiv.appendChild(button);
            rowButtons.push(button);
        }
        buttons.push(rowButtons);
    }
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

    // Delete after testing
    mines.forEach(mine => console.log(mine.row + "," + mine.col));
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
