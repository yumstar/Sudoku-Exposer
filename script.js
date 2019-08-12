window.onload = function () {
  console.log(getRows().length);
  var boxes = document.getElementsByTagName('td');
  for(var i = 0; i < boxes.length; i++){
    boxes[i].observe("click", changecolor);
    boxes[i].observe("keypress", insertnumber)
  }
}
function getRows() {
  return document.getElementsByTagName('tr');
}

function getRowCells(row) {
  var rows = getRows();
  var selectRow = rows[row];
  return selectRow.length;
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
 function validcolumn(char, col){
   var rows = getRows();
   for(var row in rows){
     var cells = row.getElementsByTagName('td')
     if(char == cells[col].innerHTML){
       return false;
     }
   }
   return true;
 }
 function validrow(char, row){
   var rows = getRows();
   var cols = rows[row].getElementsByTagName('td');
   for(var col in cols) {
     if(char == col.innerHTML){
       return false;
     }
   }
   return true;
 }
 function validbox(char, row, col){
   var boxLength = Math.sqrt((getRows()).length);
   var boxRow = Math.floor(row / boxLength);
   var boxColumn = Math.floor(col / boxLength);
   for(var i = 0; i < boxLength; i++){
     for(var j = 0; j < boxLength; j++) {
     }
   }
   return false;
 }
 function solveboard(){
   var row = document.getElementsByTagName('tr');
 }
