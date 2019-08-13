window.onload = function () {
  var boxes = document.getElementsByTagName('td');
  for(var i = 0; i < boxes.length; i++){
    boxes[i].observe("click", changecolor);
    boxes[i].observe("keypress", insertnumber)
  }
  var solveButton = document.getElementById('solve');
  solveButton.observe("click", solution);
}
function getRows() {
  return document.getElementsByTagName('tr');
}
function getRowCells(row) {
  var rows = getRows();
  var selectRow = rows[row];
  return selectRow.getElementsByTagName('td');
}
function changecolor (event){
  box = event.element();
  if(event.type == "click"){
    this.observe("keypress", insertnumber);
    this.style.backgroundColor = "#ADD8E6";
    this.observe("mouseout", changecolor);
  }
  else if (event.type == "mouseout"){
    this.stopObserving("mouseout", changecolor);
    this.stopObserving("keypress", insertnumber);
    this.style.backgroundColor = "#B7E2F0";
    setTimeout(revertcolor, 500, this);
  }
}

 function revertcolor(element){
   element.style.backgroundColor = "white";
 }
 function insertnumber(event){
   var unikey = event.charCode || event.keyCode;
   var key = String.fromCharCode(unikey);
   switch (key) {
     case "1": case "2": case "3": case "4": case "5":
     case "6": case "7": case "8": case "9": case "0":
      if(this.innerHTML != key) {
      this.innerHTML = key;
      this.stopObserving("keypress", insertnumber);
      }
     default: break;
   }
 }
 function validColumn(col, num){
   var rows = getRows();
   for(var row in rows){
     var cells = row.getElementsByTagName('td')
     if(num == cells[col].innerHTML){
       return false;
     }
   }
   return true;
 }
 function validRow(row, num){
   var rows = getRows();
   var cols = rows[row].getElementsByTagName('td');
   for(var col in cols) {
     if(num == col.innerHTML){
       return false;
     }
   }
   return true;
 }
 function validBox(row, col, num){
   var boxLength = Math.sqrt((getRows()).length);
   var boxRow = Math.floor(row / boxLength);
   var boxColumn = Math.floor(col / boxLength);
   var topRow = boxRow * boxLength;
   var leftColumn = boxColumn * boxLength;

   for(var i = 0; i < boxLength; i++){
     var currentRow = getRowCells(topRow + i);
     for(var j = 0; j < boxLength; j++) {
       if(num == currentRow[leftColumn + j].innerHTML){
         return false;
       }
     }
   }
   return true;
 }
 function validPlacement(row, col, num){
   return validRow(row, num) && validColumn(col, num) && validBox(row, col, num);
 }
 function solveCellsAfter(row, col){
   if(col == getRowCells(row).length){
     row++;
     col = 0;
     if(row == getRows().length){
       return true;
     }
   }

   var cell = (getRowCells(row))[col];
   var cellNum = parseInt(cell.innerHTML);

   if(typeof(cellNum) == "number"){
     return solveCellsAfter(row + 1, col)
   }

   for(var value = 1; value < getRowCells(0).length; value++){
     if(validPlacement(row, col, value)){
       cell.innerHTML =  value;
       if(solveCellsAfter(row + 1, col)){
         return true;
       }
     }
   }

   cell.innerHTML = "";
   return false;
 }

 function solution(){
   solveCellsAfter(0,0);
 }
