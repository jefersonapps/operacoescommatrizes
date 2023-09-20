function generateMatrices() {
  const rows1 = document.getElementById("rows1").value;
  const cols1 = document.getElementById("cols1").value;
  const rows2 = document.getElementById("rows2").value;
  const cols2 = document.getElementById("cols2").value;
  const matrices = document.getElementById("matrices");
  matrices.innerHTML = "";

  const dimensions = [
    [rows1, cols1],
    [rows2, cols2],
  ];
  for (let m = 0; m < 2; m++) {
    const table = document.createElement("table");
    table.className = "result-container"; // Adicione a classe CSS aqui
    for (let i = 0; i < dimensions[m][0]; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < dimensions[m][1]; j++) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.className = "matrix" + (m + 1);
        td.appendChild(input);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    matrices.appendChild(table);

    if (m == 0) {
      const operationSymbol = document.createElement("div");
      operationSymbol.id = "operationSymbol";
      matrices.appendChild(operationSymbol);
    }
  }

  updateOperationSymbol();
}

function updateOperationSymbol() {
  const operationSymbol = document.getElementById("operationSymbol");
  operationSymbol.innerHTML =
    document.getElementById("operation").value == "add"
      ? "$+$"
      : document.getElementById("operation").value == "subtract"
      ? "$-$"
      : "$\\times$";
  MathJax?.Hub.Queue(["Typeset", MathJax?.Hub, operationSymbol]);
}

function clearResult() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  const resultContainerDiv = document.getElementById("result-container");
  resultContainerDiv.classList.remove("result-container");

  const stepByStepDiv = document.getElementById("step-by-step");
  stepByStepDiv.innerHTML = "";
  stepByStepDiv.classList.remove("step-by-step");

  const nameMatrixC = document.getElementById("name-matrix-c");
  nameMatrixC.innerHTML = "";
}

function calculate() {
  const operation = document.getElementById("operation").value;
  const matrices = document
    .getElementById("matrices")
    .getElementsByTagName("table");
  const matrix1Cells = matrices[0].getElementsByTagName("input");
  const matrix2Cells = matrices[1].getElementsByTagName("input");

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (
    operation == "multiply" &&
    document.getElementById("cols1").value !=
      document.getElementById("rows2").value
  ) {
    const resultContainerDiv = document.getElementById("result-container");
    resultContainerDiv.classList.remove("result-container");
    resultDiv.innerText =
      "Para a multiplicação, o número de colunas da primeira matriz deve ser igual ao número de linhas da segunda matriz.";
    return;
  }

  if (
    operation != "multiply" &&
    (document.getElementById("cols1").value !=
      document.getElementById("cols2").value ||
      document.getElementById("rows1").value !=
        document.getElementById("rows2").value)
  ) {
    const resultContainerDiv = document.getElementById("result-container");
    resultContainerDiv.classList.remove("result-container");
    resultDiv.innerText =
      "Para a somar ou subtrair, as matrizes devem ter a mesma dimensão.";
    return;
  }

  const table = document.createElement("table");
  for (
    let i = 0;
    i <
    (matrix1Cells.length / document.getElementById("cols1").value) *
      document.getElementById("cols2").value;
    i++
  ) {
    if (i % document.getElementById("cols2").value == 0) {
      const tr = document.createElement("tr");
      table.appendChild(tr);
    }

    const td = document.createElement("td");
    td.className = "result";
    td.onmouseover = highlight.bind(this, i);
    td.onmouseout = unhighlight.bind(this, i);

    if (operation == "add") {
      td.innerText =
        Number(matrix1Cells[i].value) + Number(matrix2Cells[i].value);
    } else if (operation == "subtract") {
      td.innerText =
        Number(matrix1Cells[i].value) - Number(matrix2Cells[i].value);
    } else if (operation == "multiply") {
      let sum = 0;
      for (let j = 0; j < document.getElementById("cols1").value; j++) {
        sum +=
          Number(
            matrix1Cells[
              Math.floor(i / document.getElementById("cols2").value) *
                document.getElementById("cols1").value +
                j
            ].value
          ) *
          Number(
            matrix2Cells[
              j * document.getElementById("cols2").value +
                (i % document.getElementById("cols2").value)
            ].value
          );
      }
      td.innerText = sum;
    }

    table.lastChild.appendChild(td);
  }

  resultDiv.appendChild(table);
  const resultContainerDiv = document.getElementById("result-container");
  resultContainerDiv.classList.add("result-container");
  const nameMatrixC = document.getElementById("name-matrix-c");
  nameMatrixC.innerHTML = "$C=$";
  MathJax?.Hub.Queue(["Typeset", MathJax?.Hub, nameMatrixC]);
  updateStepByStep(operation, matrix1Cells, matrix2Cells);
}

function highlight(i) {
  const operation = document.getElementById("operation").value;
  const rowNumberMatrix1 = Math.floor(
    i / document.getElementById("cols2").value
  );
  const colNumberMatrix2 = i % document.getElementById("cols2").value;
  const matrix1Cells = document.getElementsByClassName("matrix1");
  const matrix2Cells = document.getElementsByClassName("matrix2");

  if (operation == "multiply") {
    for (let j = 0; j < document.getElementById("cols1").value; j++) {
      matrix1Cells[
        rowNumberMatrix1 * document.getElementById("cols1").value + j
      ].parentNode.classList.add("highlight1");
      matrix2Cells[
        j * document.getElementById("cols2").value + colNumberMatrix2
      ].parentNode.classList.add("highlight2");
    }
  } else {
    matrix1Cells[i].parentNode.classList.add("highlight1");
    matrix2Cells[i].parentNode.classList.add("highlight2");
  }
}

function unhighlight(i) {
  const operation = document.getElementById("operation").value;
  const rowNumberMatrix1 = Math.floor(
    i / document.getElementById("cols2").value
  );
  const colNumberMatrix2 = i % document.getElementById("cols2").value;
  const matrix1Cells = document.getElementsByClassName("matrix1");
  const matrix2Cells = document.getElementsByClassName("matrix2");

  if (operation == "multiply") {
    for (let j = 0; j < document.getElementById("cols1").value; j++) {
      matrix1Cells[
        rowNumberMatrix1 * document.getElementById("cols1").value + j
      ].parentNode.classList.remove("highlight1");
      matrix2Cells[
        j * document.getElementById("cols2").value + colNumberMatrix2
      ].parentNode.classList.remove("highlight2");
    }
  } else {
    matrix1Cells[i].parentNode.classList.remove("highlight1");
    matrix2Cells[i].parentNode.classList.remove("highlight2");
  }
}

function updateStepByStep(operation, matrix1Cells, matrix2Cells) {
  const stepByStepDiv = document.getElementById("step-by-step");
  stepByStepDiv.innerHTML = ""; // Limpa o conteúdo anterior
  stepByStepDiv.classList.add("step-by-step");

  const rows1 = document.getElementById("rows1").value;
  const cols1 = document.getElementById("cols1").value;

  if (operation == "add") {
    stepByStepDiv.innerHTML += "<h3>Passo a passo da soma:</h3><ol>";
    for (let i = 0; i < rows1; i++) {
      for (let j = 0; j < cols1; j++) {
        const index = i * cols1 + j;
        const num1 = Number(matrix1Cells[index].value);
        const num2 = Number(matrix2Cells[index].value);
        const result = num1 + num2;
        stepByStepDiv.innerHTML += `<li>Soma para obter o elemento na posição $c_{${
          i + 1
        }${
          j + 1
        }}$ = <span class="math-tex-inline">$$${num1} + ${num2} = ${result}$$</span></li>`;
      }
    }
    stepByStepDiv.innerHTML += "</ol>";
  } else if (operation == "subtract") {
    stepByStepDiv.innerHTML += "<h3>Passo a passo da subtração:</h3><ol>";
    for (let i = 0; i < rows1; i++) {
      for (let j = 0; j < cols1; j++) {
        const index = i * cols1 + j;
        const num1 = Number(matrix1Cells[index].value);
        const num2 = Number(matrix2Cells[index].value);
        const result = num1 - num2;
        stepByStepDiv.innerHTML += `<li>Subtração para obter o elemento na posição $c_{${
          i + 1
        }${
          j + 1
        }}$ = <span class="math-tex-inline">$$${num1} - ${num2} = ${result}$$</span></li>`;
      }
    }
    stepByStepDiv.innerHTML += "</ol>";
  } else if (operation == "multiply") {
    stepByStepDiv.innerHTML += "<h3>Passo a passo da multiplicação:</h3><ol>";
    const rows1 = document.getElementById("rows1").value;
    const cols1 = document.getElementById("cols1").value;
    const cols2 = document.getElementById("cols2").value;

    for (let i = 0; i < rows1; i++) {
      for (let j = 0; j < cols2; j++) {
        stepByStepDiv.innerHTML += `<li>Para obter o elemento $c_{${i + 1}${
          j + 1
        }}$, multiplicamos a linha $${i + 1}$ da matriz $A$ pela coluna $${
          j + 1
        }$ da matriz $B$:</li><ul>`;

        let sumString = "";
        for (let k = 0; k < cols1; k++) {
          const num1 = Number(matrix1Cells[i * cols1 + k].value);
          const num2 = Number(matrix2Cells[k * cols2 + j].value);

          if (k > 0) {
            sumString += " + ";
          }
          sumString += `${num1} \\times ${num2}`;
        }

        let sum = 0;
        for (let k = 0; k < cols1; k++) {
          const num1 = Number(matrix1Cells[i * cols1 + k].value);
          const num2 = Number(matrix2Cells[k * cols2 + j].value);
          sum += num1 * num2;
        }
        stepByStepDiv.innerHTML += `<span class="math-tex-inline">$$${sumString} = ${sum}$$</span>`;

        stepByStepDiv.innerHTML += `<span class="math-tex-block">Resultado para $c_{${
          i + 1
        }${j + 1}} = ${sum}$</span></ul>`;
      }
    }
    stepByStepDiv.innerHTML += "</ol>";
  }

  MathJax?.Hub.Queue(["Typeset", MathJax?.Hub, stepByStepDiv]);
}

document
  .getElementById("generateMatrices")
  .addEventListener("click", generateMatrices);
document.getElementById("operation").addEventListener("change", () => {
  updateOperationSymbol();
  clearResult();
});
document.getElementById("calculate").addEventListener("click", calculate);

let button = document.getElementById("calculate");

function fillRandomNumbers() {
  let range = prompt(
    "Digite o intervalo de valores no formato: min, max",
    "-10, 10"
  );
  let [min, max] = range.split(",").map(Number);

  const rows1 = document.getElementById("rows1").value;
  const cols1 = document.getElementById("cols1").value;
  const rows2 = document.getElementById("rows2").value;
  const cols2 = document.getElementById("cols2").value;

  if (rows1 === "" || cols1 === "" || rows2 === "" || cols2 === "") {
    alert(
      "Por favor, defina as dimensões das matrizes antes de preenchê-las aleatoriamente."
    );
    return;
  }

  // Obtém todas as células de entrada das tabelas
  const matrix1Cells = document.getElementsByClassName("matrix1");
  const matrix2Cells = document.getElementsByClassName("matrix2");

  if (matrix1Cells.length === 0 || matrix2Cells.length === 0) {
    alert(
      "As tabelas das matrizes não estão presentes na tela. Clique em 'Gerar Matrizes' primeiro."
    );
    return;
  }
  // Preenche as células com números aleatórios
  for (const cell of matrix1Cells) {
    cell.value = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  for (const cell of matrix2Cells) {
    cell.value = Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
document
  .getElementById("fillRandomButton")
  .addEventListener("click", fillRandomNumbers);
