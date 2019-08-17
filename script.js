var solved = false;

window.onload = function() {
  var cells = getAllCells();
  var solveButton = document.getElementById('solve');
  var clearButton = document.getElementById('clear');
  for (var i = 0; i < cells.length; i++) {
    cells[i].observe("click", changecolor);
    cells[i].observe("keypress", insertnumber)
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
  if (event.type == "click") {
    if (solved) {
      solved = false;
      clearBoard();
    }
    this.observe("keypress", insertnumber);
    this.style.backgroundColor = "#ADD8E6";
    this.observe("mouseout", changecolor);
  }
  else if (event.type == "mouseout") {
    this.stopObserving("mouseout", changecolor);
    this.stopObserving("keypress", insertnumber);
    this.style.backgroundColor = "#B7E2F0";
    setTimeout(revertcolor, 500, this);
  }
}

function revertcolor(element) {
  element.style.backgroundColor = "white";
}

function insertnumber(event) {
  var unikey = event.charCode || event.keyCode;
  var key = String.fromCharCode(unikey);
  switch (key) {
    case "1": case "2": case "3": case "4": case "5":
    case "6": case "7": case "8": case "9": case "0":
      if (this.innerHTML != key) {
        this.innerHTML = key;
        //this.stopObserving("keypress", insertnumber);
      }
    case "w": case "a": case "s": case "d":
      for (var i = 0; i < getRows().length; i++) {
        var currentRow = getRowCells(i);
        for (var j = 0; j < getRowCells(i).length; j++) {
          if (this == currentRow[j]) {
            switch (key) {
              case "w":
                var prevRowCells = getRowCells(mod(i - 1, getRows().length));
                var cellAbove = prevRowCells[j];
                cellAbove.focus();
                break;
              case "s":
                var nextRowCells = getRowCells(mod(i + 1, getRows().length));
                var cellBelow = nextRowCells[j];
                cellBelow.focus();
                break;
              case "a":
                var leftCell = currentRow[mod(j - 1, getRowCells(i).length)];
                leftCell.focus();
                break;
              case "d":
                var rightCell = currentRow[mod(j + 1, getRowCells(i).length)];
                rightCell.focus();
                break;
            }
          }
        }
      }
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
