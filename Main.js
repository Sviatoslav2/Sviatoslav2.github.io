let TIME;

let PLAYING_KEY = false;

let ROWS_NUMBER = 50;
let COLUMNS_NUMBER = 200;

let GRID = new Array(ROWS_NUMBER);
let NEW_GRID = new Array(ROWS_NUMBER);

let TIME_OF_REPRODUCTION = 100;



function initialize() {
    createTable();
    initializeGrids();
    upLoadGrids();
    setupButtons();
}


function initializeGrids() {
    let row = 0;
    while (row < ROWS_NUMBER){
        GRID[row] = new Array(COLUMNS_NUMBER);
        NEW_GRID[row] = new Array(COLUMNS_NUMBER);
        row++;
    }
}

function upLoadGrids() {
    for (let row = 0; row < ROWS_NUMBER; row++) {
        for (let col = 0; col < COLUMNS_NUMBER; col++) {
            GRID[row][col] = 0;
            NEW_GRID[row][col] = 0;
        }
    }
}

function copyAndResetGrid(){
    for (let row = 0; row < ROWS_NUMBER; row++) {
        for (let col = 0; col < COLUMNS_NUMBER; col++) {
            GRID[row][col] = NEW_GRID[row][col];
            NEW_GRID[row][col] = 0;
        }
    }
}


function createTable() {
    let gridContainer = document.getElementById('grid_сontainer');
    if (!gridContainer) {

        console.error("Div out of table!");
    }
    let table = document.createElement("table");

    for (let row = 0; row < ROWS_NUMBER; row++) {
        let tr = document.createElement("tr");
        for (let col = 0; col < COLUMNS_NUMBER; col++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", row + "_" + col);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function cellClickHandler() {
    let rowcol = this.id.split("_");
    let row = rowcol[0];
    let col = rowcol[1];

    let classes = this.getAttribute("class");
    if(classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        GRID[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        GRID[row][col] = 1;
    }

}

function viewUpdate() {
    for (let row = 0; row < ROWS_NUMBER; row++){
        for (let col = 0; col < COLUMNS_NUMBER; col++) {
            let cell = document.getElementById(row + "_" + col);
            if (!GRID[row][col]) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

function setupButtons() {
    const startButton = document.getElementById('startButton');
    startButton.onclick = startButtonHandler;
    const clearButton = document.getElementById('clearButton');
    clearButton.onclick = clearButtonHandler;
    const randomButton = document.getElementById("randomButton");
    randomButton.onclick = randomButtonHandler;
}

function randomButtonHandler() {
    if (PLAYING_KEY) return;
    clearButtonHandler();
    for (let i = 0; i < ROWS_NUMBER; i++) {
        for (let j = 0; j < COLUMNS_NUMBER; j++) {
            let isLive = Math.round(Math.random());
            if (isLive) {
                let cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                GRID[i][j] = 1;
            }
        }
    }
}


function clearButtonHandler() {
    console.log("Clear the game: stop playing_key, clear the Grid");

    PLAYING_KEY = false;
    let startButton = document.getElementById('startButton');
    startButton.innerHTML = "Start";
    clearTimeout(TIME);

    let cellsList = document.getElementsByClassName("live");

    let cells = [];
    for (let celNumber = 0; celNumber < cellsList.length; celNumber++) {
        cells.push(cellsList[celNumber]);
    }


    for (let index = 0; index < cells.length; index++) {
        cells[index].setAttribute("class", "dead");
    }
    upLoadGrids;
}


function startButtonHandler() {
    if (PLAYING_KEY) {
        console.log("Pause the game");
        PLAYING_KEY = false;
        this.innerHTML = "Continue";
        clearTimeout(TIME);
    } else {
        console.log("Continue the game");
        PLAYING_KEY = true;
        this.innerHTML = "Pause";
        play();
    }
}


function play() {
    computeNextGen();
    if (PLAYING_KEY) {
        TIME = setTimeout(play, TIME_OF_REPRODUCTION);
    }
}

function computeNextGen() {
    for (let i = 0; i < ROWS_NUMBER; i++) {
        for (let j = 0; j < COLUMNS_NUMBER; j++) {
            applyRules(i, j);
        }
    }

    copyAndResetGrid();

    viewUpdate();
}


function applyRules(row, col) {
    let numNeighbors = countNeighbors(row, col);
    if (GRID[row][col] == 1) {
        if (numNeighbors < 2) {
            NEW_GRID[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            NEW_GRID[row][col] = 1;
        } else if (numNeighbors > 3) {
            NEW_GRID[row][col] = 0;
        }
    } else if (!GRID[row][col]) {
        if (numNeighbors == 3) {
            NEW_GRID[row][col] = 1;
        }
    }
}

function countNeighbors(row, col) {
    let count = 0;
    if (row-1 >= 0) {
        if (GRID[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (GRID[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < COLUMNS_NUMBER) {
        if (GRID[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (GRID[row][col-1] == 1) count++;
    }
    if (col+1 < COLUMNS_NUMBER) {
        if (GRID[row][col+1] == 1) count++;
    }
    if (row+1 < ROWS_NUMBER) {
        if (GRID[row+1][col] == 1) count++;
    }
    if (row+1 < ROWS_NUMBER && col-1 >= 0) {
        if (GRID[row+1][col-1] == 1) count++;
    }
    if (row+1 < ROWS_NUMBER && col+1 < COLUMNS_NUMBER) {
        if (GRID[row+1][col+1] == 1) count++;
    }
    return count;
}
function clearHtml(){
    document.getElementById("grid_сontainer").innerHTML = '';
}

// Start everything
window.onload = initialize();
function handleInputChange(element){
    let count = 0;
    if(element.value > 250){
        count = 250;
    }else if(element.value < 0){
        count = 0;
    }else{
        count = element.value;
    }
    if(element.id === "rowInput"){
        ROWS_NUMBER = count;
        GRID = new Array(ROWS_NUMBER);
        NEW_GRID = new Array(ROWS_NUMBER);
    }else{
        COLUMNS_NUMBER = count;
        GRID = new Array(COLUMNS_NUMBER);
        NEW_GRID = new Array(COLUMNS_NUMBER);
    }
    clearHtml();
    initialize();
}
document.getElementById("rowInput").addEventListener('input', function () {
    handleInputChange(this);
});
document.getElementById("columnInput").addEventListener('input', function () {
    handleInputChange(this);
});