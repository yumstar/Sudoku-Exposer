var solved = false;
const requiredNumOfValues = 17;

window.onload = function() {
  var cells = getAllCells();
  var solveButton = document.getElementById('solve');
  var clearButton = document.getElementById('clear');
  for (var i = 0; i < cells.length; i++) {
    cells[i].observe("click", changecolor);
    cells[i].observe("keydown", insertnumber)
    cells[i].observe("focus", changecolor);
    cells[i].observe("blur", changecolor);
  }
  solveButton.observe("click", getSolution);
  clearButton.observe("click", clearBoard);
}

function getRows() {
  return document.getElementsByTagName('tr');
}


function getRowCells(row) {
  var rows = getRows();
  var selectRow = rows[row];
  return selectRow.getElementsByTagName('td');
}

function getRowLength(row){
  return (getRowCells(row)).length;
}

function getColumnCells(col){
  var columnLength = getRows().length;
  var cells = [];
  for(var i = 0; i < columnLength; i++){
    var row =  getRowCells(i);
    cells[i] = row[col];
  }
  console.log(cells);
  return cells;
}

function getAllCells() {
  return document.getElementsByTagName('td');
}

function changecolor(event) {
  box = event.element();
  if (event.type == "click" || event.type == "focus") {
    if (solved) {
      solved = false;
      clearBoard();
    }
    this.observe("keydown", insertnumber);
    this.style.backgroundColor = "#ADD8E6";
    this.observe("mouseout", changecolor);
  }
  else if (event.type == "mouseout" || event.type == "blur") {
    this.stopObserving("mouseout", changecolor);
    this.stopObserving("keydown", insertnumber);
    this.style.backgroundColor = "#B7E2F0";
    setTimeout(revertcolor, 100, this);
  }
}

function revertcolor(element) {
  element.style.backgroundColor = "white";
}

function insertnumber(event) {
  // var unikey = event.charCode || event.keyCode;
  var key = event.key;
  switch (key) {
    case "1": case "2": case "3": case "4": case "5":
    case "6": case "7": case "8": case "9":
      // if (this.innerHTML != key) {
        this.innerHTML = key;
        // var cells = getAllCells();
        // var index = getCellIndex(this, cells);
        // if(index >= 0){
        //   if(index < cells.length - 1){
        //     var nextCell = cells[index + 1];
        //     nextCell.focus();
        //   }
        //   else {
        //     this.blur();
        //   }
        // }
        // for(var i = 0; i < cells.length - 1; i++){
        //   if(this == cells[i]){
        //     var nextCell = cells[i + 1];
        //     nextCell.focus();
        //   }
        // }
        break;
        //this.stopObserving("keypress", insertnumber);
      // }
    case "ArrowUp": case "ArrowDown": case "ArrowLeft": case "ArrowRight":
    case "w": case "s": case "a": case "d":
      for (var row = 0; row < getRows().length; row++) {
        var currentRow = getRowCells(row);
        var col = getCellIndex(this, currentRow);
        if(col >= 0){
        // for (var k = 0; k < currentRow.length; k++) {
        //   if (this == currentRow[k]) {
            switch (key) {
              case "ArrowUp": case "w":
                var prevRowCells = getRowCells(mod(row - 1, getRows().length));
                var cellAbove = prevRowCells[col];
                cellAbove.focus();
                break;
              case "ArrowDown": case "s":
                var nextRowCells = getRowCells(mod(row + 1, getRows().length));
                var cellBelow = nextRowCells[col];
                cellBelow.focus();
                break;
              case "ArrowLeft": case "a":
                var leftCell = currentRow[mod(col - 1, getRowCells(row).length)];
                leftCell.focus();
                break;
              case "ArrowRight": case "d":
                var rightCell = currentRow[mod(col + 1, getRowCells(row).length)];
                rightCell.focus();
                break;
            }
            break;
          }
        //   }
        // }
      }
      break;
    case "Backspace": this.innerHTML = ""; break;
    default: break;
  }
}

function clearBoard() {
  var cells = getAllCells();
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerHTML = "";
  }
  if(solved){
    var solveButton = document.getElementById('solve');
    solveButton.innerHTML = "Solve!";
  }
}

function validColumn(col, num) {
  for (var row = 0; row < (getRows()).length; row++) {
    var cells = getRowCells(row);
    if (num == cells[col].innerHTML) {
      return false;
    }
  }
  return true;
}

function validRow(row, num) {
  var cols = getRowCells(row);
  for (var col = 0; col < cols.length; col++) {
    if (num == cols[col].innerHTML) {
      return false;
    }
  }
  return true;
}

function validBox(row, col, num) {
  var boxLength = Math.sqrt((getRows()).length);
  var boxRow = Math.floor(row / boxLength);
  var boxColumn = Math.floor(col / boxLength);
  var topRow = boxRow * boxLength;
  var leftColumn = boxColumn * boxLength;

  for (var i = 0; i < boxLength; i++) {
    var currentRow = getRowCells(topRow + i);
    for (var j = 0; j < boxLength; j++) {
      if (num == currentRow[leftColumn + j].innerHTML) {
        return false;
      }
    }
  }
  return true;
}

function validPlacement(row, col, num) {
  return validRow(row, num) && validColumn(col, num) && validBox(row, col, num);
}

function solveCellsAfter(row, col) {
  if (col == getRows().length) {
    // console.log("row: ", row, " col: ", col);
    // console.log("end reached");
    col = 0;
    row++;
    if (row == getRowCells(0).length) {
      return true;
    }
  }
  var cell = (getRowCells(row))[col];
  var cellNum = parseInt(cell.innerHTML);

  if (!isNaN(cellNum)) {
    // console.log("row: ", row, " col: ", col);
    // console.log(cellNum);
    // console.log("skip");
    return solveCellsAfter(row, col + 1);
  }

  for (var value = 1; value <= getRows().length; value++) {
    if (validPlacement(row, col, value)) {
      // console.log("row: ", row, " col: ", col);
      // console.log(value);
      // console.log("valid placement");
      cell.innerHTML = value;
      if (solveCellsAfter(row, col + 1)) {
        return true;
      }
    }
  }

  cell.innerHTML = "";
  return false;
}

function getSolution() {
  setMessage("");
  if(enoughValues() && checkBoard()){
    if (solveCellsAfter(0, 0)) {
      var message = document.getElementById('message');
      solved = true;
      this.innerHTML = "Solved!"
      if(message.innerHTML.length > 0)
      setMessage("");
    }
  }
}

function enoughValues(){
  var cells = getAllCells();
  var numOfValues = 0;
  for(var i = 0; i < cells.length; i++){
    var cellNum = parseInt(cells[i].innerHTML);
    if(!isNaN(cellNum)){
      numOfValues++;
    }
    if(numOfValues >= requiredNumOfValues){
      return true;
    }
  }
  var message = document.getElementById('message');
  message.innerHTML ="Error. The board does not contain enough given values.";
  return false;
}

function checkBoard() {
  console.log("checkBoard");
    return checkRows() && checkColumns() && checkBoxes();
  // var rowLength = getRowLength(0);
  // for(var row = 0; row < rowLength; row++){
  //   var rowNums = [];
  //   var i = 0;
  //   for(var col = 0; col < rowLength; col++){
  //     var cell = (getRowCells(row))[col];
  //     var cellNum = parseInt(cell.innerHTML);
  //     if(!isNaN(cellNum)){
  //       rowNums[i] = cellNum;
  //       i++;
  //     }
  //   }
  //   rowNums.sort(sortNums);
  //   for(var j = 0; j < i - 1; j++){
  //     if(rowNums[j] == rowNums[j + 1]){
  //       var message = document.getElementById('message');
  //       message.innerHTML = "Error: Non-valid board.";
  //       return false;
  //     }
  //   }
  // }
  // return true;
}

function mod(a, b) {
  return (a + b) % b;
}

function containsDuplicates(set){
  var i = 0;
  var cellNums = [];
  for(var j = 0; j < set.length; j++){
    var cellNum = parseInt(set[j].innerHTML);
    if(!isNaN(cellNum)){
      cellNums[i] = cellNum;
      i++;
    }
  }
  cellNums.sort(sortNums);
  for(var k = 0; k < i - 1; k++){
    if(cellNums[k] == cellNums[k + 1]){
      var message = document.getElementById('message');
      message.innerHTML = "Error: Non-valid board.";
      return false;
    }
  }
}

function checkRows(){
  var rowLength = getRowCells(0).length;
  var cells;
  for(var row = 0; row < rowLength; row++){
    cells = getRowCells(row);
    if(containsDuplicates(cells)){
      return false;
    }
  }
  return true;
}

function checkColumns(){
  console.log("yes");
  var columnLength = (getRows()).length;
  var cells;
  for(var col = 0; col < columnLength; col++){
    cells = getColumnCells(col);
    if(containsDuplicates(cells)){
      return false;
    }
  }
  return true;
}

function checkBoxes(){
  var boxLength = Math.sqrt((getRows()).length);
  for(var row = 0; row < boxLength; row++){
    for(var col = 0; col < boxLength; col++){
      var boxRow = Math.floor(row / boxLength);
      var boxColumn = Math.floor(col / boxLength);
      var topRow = boxRow * boxLength;
      var leftColumn = boxColumn * boxLength;
      var cells = [];
      var i = 0;

      for(var j = 0; j < boxLength; j++){
        var currentRow = getRowCells(topRow + j);
        for(var k = 0; k < boxLength; k++){
          cells[i++] = currentRow[leftColumn + k];
        }
      }
      if(containsDuplicates(cells)){
        return false;
      }
    }
  }
  return true;
}
// function parseCellNum(row, col){
//   var cell = (getRowCells(row))[col];
//   var cellNum = parseInt(cell.innerHTML);
//   return cellNum;
// }

function sortNums(a, b){
  return a-b;
}

function setMessage(message){
  var messageLabel = document.getElementById('message');
  messageLabel.innerHTML = message;
}
function getCellIndex(cell, arr){
  for(var i = 0; i < arr.length; i++){
    if(cell == arr[i]){
      return i;
    }
  }
  return -1;
}
