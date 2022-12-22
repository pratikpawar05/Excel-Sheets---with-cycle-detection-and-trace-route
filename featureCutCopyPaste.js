let ctrlKey;
document.addEventListener("keydown", (e) => {
  ctrlKey = e.ctrlKey;
});
document.addEventListener("keyup", (e) => {
  ctrlKey = e.ctrlKey;
});
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    handleSelectedCells(cell);
  }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];
function handleSelectedCells(cell) {
  cell.addEventListener("click", (e) => {
    // Select cells range work
    if (!ctrlKey) return;
    if (rangeStorage.length >= 2) {
      defaultSelectedCellsUI();
      rangeStorage = [];
    }

    // UI
    cell.style.border = "3px solid #218c74";

    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));
    rangeStorage.push([rid, cid]);
    console.log(rangeStorage);
  });
}
function defaultSelectedCellsUI() {
  for (let i = 0; i < rangeStorage.length; i++) {
    let cell = document.querySelector(
      `.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`
    );
    cell.style.border = "1px solid lightgrey";
  }
}

let copyData = [];

copyBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;
  copyData = [];
  // let [strow, stcol, endrow, endcol] = [
  //   rangeStorage[0][0],
  //   rangeStorage[0][1],
  //   rangeStorage[1][0],
  //   rangeStorage[1][1],
  // ];

  let [strow, stcol, endrow, endcol] = [
    Math.min(rangeStorage[0][0], rangeStorage[1][0]),
    Math.min(rangeStorage[0][1], rangeStorage[1][1]),
    Math.max(rangeStorage[0][0], rangeStorage[1][0]),
    Math.max(rangeStorage[0][1], rangeStorage[1][1]),
  ];
  // console.log([strow, stcol, endrow, endcol]);

  for (let i = strow; i <= endrow; i++) {
    let copyRow = [];
    for (let j = stcol; j <= endcol; j++) {
      let cellProp = sheetDB[i][j];
      copyRow.push(cellProp);
    }
    copyData.push(copyRow);
  }
  console.log(copyData);
  defaultSelectedCellsUI();
});
