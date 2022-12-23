//
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [activeCell, cellProp] = getCellAndCellProp(address);
      let enteredData = activeCell.innerText;
      //   console.log(enteredData + "---" + cellProp.value);
      //   console.log(address);
      if (enteredData == cellProp.value) {
        return;
      }

      cellProp.value = enteredData;
      // If data modifies remove P-C relation, formula empty, update children with new hardcoded (modified) value
      removeChildFromParent(cellProp.formula);
      cellProp.formula = "";

      updateChildrenCells(address);
    });
  }
}

// Formula Bar handling code - getting the formual fixed format i.e. ( expresion1 Artimatic operator expresion2 ) to updating UI is done here
let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    if (inputFormula !== cellProp.formula) {
      removeChildFromParent(cellProp.formula);
    }
    // for cycle detection(if any)
    addChildToParent(inputFormula, address);
    let isGraphCyclic = updateChildrenCells(address);
    // console.log(isGraphCyclic);
    if (isGraphCyclic.cyclePresent === true) {
      await formulaDetectionCyclicTracePath(isGraphCyclic.cyclePath);
      removeChildFromParent(inputFormula);
      return;
    }

    let evaluatedValue = evaluateFormula(inputFormula);
    // / To update UI and cellProp in DB
    setCellUIAndCellProp(evaluatedValue, inputFormula, address);

    updateChildrenCells(address);
  }
});

function removeChildFromParent(formula) {
  // console.log("formula: " + formula);
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

function addChildToParent(formula, childAddress) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      parentCellProp.children.push(childAddress);
    }
  }
}

function updateChildrenCells(parentAddress) {
  let visited = {};
  let pathVisited = {};
  let evalStack = [];
  let isGraphCyclic = topologicalSort(
    parentAddress,
    visited,
    pathVisited,
    evalStack
  );
  if (isGraphCyclic) {
    evalStack.push(parentAddress);
    return {
      cyclePath: evalStack,
      cyclePresent: true,
    };
  }

  for (let idx = evalStack.length - 2; idx >= 0; idx--) {
    let address = evalStack[idx];
    let [cell, cellProp] = getCellAndCellProp(address);
    let formula = cellProp.formula;
    let evaluatedValue = evaluateFormula(formula);
    setCellUIAndCellProp(evaluatedValue, formula, address);
  }
  // console.log(pathVisited);
  return {
    cyclePath: null,
    cyclePresent: false,
  };
}
// Get dependecy of each cell in the excel formula
function topologicalSort(parentAddress, visited, pathVisited, evalStack) {
  let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);

  if (visited[parentAddress]) return;

  visited[parentAddress] = true;
  pathVisited[parentAddress] = true;
  let children = parentCellProp.children;

  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    if (visited[childAddress] && pathVisited[childAddress]) {
      evalStack = [];
      evalStack.push(childAddress);
      return true;
    }

    let response = topologicalSort(
      childAddress,
      visited,
      pathVisited,
      evalStack
    );
    if (response) {
      evalStack.push(childAddress);
      return true;
    }
  }
  pathVisited[parentAddress] = false;
  evalStack.push(parentAddress);
  return false;
}

function evaluateFormula(formula) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
  let [cell, cellProp] = getCellAndCellProp(address);
  //UI update
  cell.innerText = evaluatedValue;
  // DB update
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}
