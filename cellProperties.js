let collectedSheetDB = []; //Contains all SheetDB
let sheetDB = [];
{
  let addSheetBtn = document.querySelector(".sheet-add-icon");
  addSheetBtn.click();
}

// for (let i = 0; i < rows; i++) {
//   let sheetRow = [];
//   for (let j = 0; j < cols; j++) {
//     let cellProp = {
//       bold: false,
//       italic: false,
//       underline: false,
//       alignment: "initial",
//       fontFamily: "monospace",
//       fontSize: "14",
//       fontColor: "#000000",
//       BGcolor: "#000000", // Just for indication purpose,
//       value: "",
//       formula: "",
//       children: [],
//     };
//     sheetRow.push(cellProp);
//   }
//   sheetDB.push(sheetRow);
// }

// Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");

let textAlignment = {
  left: alignment[0],
  center: alignment[1],
  right: alignment[2],
};

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

/* Bold Property */
bold.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);
  // Modification
  cellProp.bold = !cellProp.bold; // Data change
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; // UI change (1)
  bold.style.backgroundColor = cellProp.bold
    ? activeColorProp
    : inactiveColorProp; // UI change (2)
});
/* Italic Property */
italic.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);
  // Modification
  cellProp.italic = !cellProp.italic; // Data change
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; // UI change (1)
  italic.style.backgroundColor = cellProp.italic
    ? activeColorProp
    : inactiveColorProp; // UI change (2)
});
/* Underline Property */
underline.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);
  // Modification
  cellProp.underline = !cellProp.underline; // Data change
  cell.style.textDecoration = cellProp.underline ? "underline" : "none"; // UI change (1)
  underline.style.backgroundColor = cellProp.underline
    ? activeColorProp
    : inactiveColorProp; // UI change (2)
});
/* FontSize Property */

fontSize.addEventListener("change", (e) => {
  console.log("value" + e.target.value);
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);
  // Modification
  cellProp.fontSize = fontSize.value; // Data change
  cell.style.fontSize = cellProp.fontSize + "px"; // UI change (1)
});

/* FontFamily Property */
fontFamily.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontFamily = fontFamily.value; // Data change
  cell.style.fontFamily = cellProp.fontFamily;
  fontFamily.value = cellProp.fontFamily;
});
/* FontColor Property */
fontColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontColor = fontColor.value; // Data change
  cell.style.color = cellProp.fontColor;
  fontColor.value = cellProp.fontColor;
});
/* BackgroundColor Property */
BGcolor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.BGcolor = BGcolor.value; // Data change
  cell.style.backgroundColor = cellProp.BGcolor;
  BGcolor.value = cellProp.BGcolor;
});

// Set Alignment Property
alignment.forEach((align) => {
  align.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (cellProp.alignment != "initial")
      textAlignment[cellProp.alignment].style.backgroundColor =
        inactiveColorProp;

    cellProp.alignment = align.classList[0];
    cell.style.textAlign = cellProp.alignment;

    align.style.backgroundColor = activeColorProp;
  });
});

// Set Each Cell Property
let allCells = document.querySelectorAll(".cell");
for (let cellIdx = 0; cellIdx < allCells.length; cellIdx++) {
  addEventListenerToAttachCellProperties(allCells[cellIdx]);
}
// 2-way binding
function addEventListenerToAttachCellProperties(cell) {
  cell.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    let cellProp = sheetDB[rid][cid];

    // Apply cell Properties
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor =
      cellProp.BGcolor === "#000000" ? "transparent" : cellProp.BGcolor;
    cell.style.textAlign = cellProp.alignment;

    // Apply properties UI Props container
    bold.style.backgroundColor = cellProp.bold
      ? activeColorProp
      : inactiveColorProp;
    italic.style.backgroundColor = cellProp.italic
      ? activeColorProp
      : inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline
      ? activeColorProp
      : inactiveColorProp;
    fontColor.value = cellProp.fontColor;
    BGcolor.value = cellProp.BGcolor;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    // set text alignment of object
    for (const align in textAlignment) {
      const element = textAlignment[align];
      element.style.backgroundColor = inactiveColorProp;
    }
    if (cellProp.alignment != "initial")
      textAlignment[cellProp.alignment].style.backgroundColor = activeColorProp;

    let formulaBar = document.querySelector(".formula-bar");
    formulaBar.value = cellProp.formula;
    cell.innerText = cellProp.value;
  });
}
// Cell -> [row,col]
function getCellAndCellProp(address) {
  let [rid, cid] = decodeRIDCIDFromAddress(address);
  // Access cell & storage object
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProp = sheetDB[rid][cid];
  return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
  // address -> "A1"
  let rid = Number(address.slice(1) - 1); // "1" -> 0
  let cid = Number(address.charCodeAt(0)) - 65; // "A" -> 65
  return [rid, cid];
}
