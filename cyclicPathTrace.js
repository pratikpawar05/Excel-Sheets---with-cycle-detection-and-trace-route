// For delay and wait
function colorPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function formulaDetectionCyclicTracePath(cyclicCells) {
  let response = confirm(
    "Your formula is cyclic. Do you want to trace your path?"
  );
  while (response === true) {
    // Keep on tracking color until user is sartisfied
    await isGraphCylicTracePath(cyclicCells);
    response = confirm(
      "Your formula is cyclic. Do you want to trace your path?"
    );
  }
  return Promise.resolve(true);
}

async function isGraphCylicTracePath(cyclicCells) {
  //   First iteration setting the background color to blue
  for (let cellIdx = cyclicCells.length - 1; cellIdx >= 0; cellIdx--) {
    let [cell, cellProp] = getCellAndCellProp(cyclicCells[cellIdx]);
    cell.style.backgroundColor = "lightblue";
    await colorPromise();
  }

  let [cell, cellProp] = getCellAndCellProp(
    cyclicCells[cyclicCells.length - 1]
  );
  cell.style.backgroundColor = "lightsalmon";
  await colorPromise();
  cell.style.backgroundColor = "transparent";
  await colorPromise();
  //   Second iteration setting the background color to transparent
  for (let cellIdx = 0; cellIdx < cyclicCells.length - 1; cellIdx++) {
    let [cell, cellProp] = getCellAndCellProp(cyclicCells[cellIdx]);
    cell.style.backgroundColor = "transparent";
    await colorPromise();
  }

  return Promise.resolve(true);
}
