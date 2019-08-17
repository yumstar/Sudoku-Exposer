var solved = false;

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
  console.log(key);
  switch (key) {
    case "1": case "2": case "3": case "4": case "5":
    case "6": case "7": case "8": case "9":
      // if (this.innerHTML != key) {
        this.innerHTML = key;
        var cells = getAllCells();
        for(var i = 0; i < cells.length - 1; i++){
          if(this == cells[i]){
            var nextCell = cells[i + 1];
            nextCell.focus();
          }
        }
        break;
        //this.stopObserving("keypress", insertnumber);
      // }
    case "ArrowUp": case "ArrowDown": case "ArrowLeft": case "ArrowRight":
    case "w": case "s": case "a": case "d":
      for (var j = 0; j < getRows().length; j++) {
        var currentRow = getRowCells(j);
        for (var k = 0; k < currentRow.length; k++) {
          if (this == currentRow[k]) {
            switch (key) {
              case "ArrowUp": case "w":
                var prevRowCells = getRowCells(mod(j - 1, getRows().length));
                var cellAbove = prevRowCells[k];
                cellAbove.focus();
                break;
              case "ArrowDown": case "s":
                var nextRowCells = getRowCells(mod(j + 1, getRows().length));
                var cellBelow = nextRowCells[k];
                cellBelow.focus();
                break;
              case "ArrowLeft": case "a":
                var leftCell = currentRow[mod(k - 1, getRowCells(j).length)];
                leftCell.focus();
                break;
              case "ArrowRight": case "d":
                var rightCell = currentRow[mod(k + 1, getRowCells(j).length)];
                rightCell.focus();
                break;
            }
          }
        }
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
  if (solveCellsAfter(0, 0)) {
    solved = true;
    this.innerHTML = "Solved!"
  }
}

function mod(a, b) {
  return (a + b) % b;
}

function getCellIndex(cell, arr){
  for(var i = 0; i < arr.length; i++){
    if(cell == arr[i]){
      return i;
    }
  }
  return -1;
}
