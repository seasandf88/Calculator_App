const lightMode = document.getElementById("light");

const result = document.getElementById("result");
const temp = document.getElementById("temp");

const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");

const clear = document.getElementById("clear");
const clearEntry = document.getElementById("clearEntry");
const erase = document.getElementById("erase");

const times = document.getElementById("Multiply");
const divide = document.getElementById("Divide");
const plus = document.getElementById("Add");
const minus = document.getElementById("Subtract");
const equals = document.getElementById("equals");
const percent = document.getElementById("percent");

// Variables
let operationActive = false;
let operation = null;
let firstMem = null;
let secondMem = null;

// Event listeners
lightMode.addEventListener("click", () => {
  document.querySelector("body").classList.toggle("light");
  lightMode.classList.toggle("active");
  lightMode.innerText === "Light"
    ? (lightMode.innerText = "Dark")
    : (lightMode.innerText = "Light");
});

numbers.forEach((number) => {
  number.addEventListener("click", (e) => numKey(e.target));
});

function numKey(target) {
  if (target.getAttribute("id") === "negate") {
    negate();
    return;
  }
  if (target.getAttribute("id") === "Decimal") {
    if (result.innerHTML.includes(".")) return;
  }

  if (operationActive) {
    result.innerText = "";
    result.innerText += target.innerHTML;
    operationActive = false;
  } else if (result.innerText.length < 16) {
    result.innerText += target.innerHTML;
  }
  secondMem = Number(result.innerText);
}

document.addEventListener("keydown", (e) => {
  let id = e.code.slice(6, e.code.length);
  let target = document.getElementById(id);
  if (
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Decimal"].includes(id)
  ) {
    numKey(target);
  } else if (["Add", "Multiply", "Subtract", "Divide"].includes(id)) {
    opKey(target);
  } else if (e.code === "NumpadEnter") {
    equal(operation, firstMem, secondMem);
  }
  console.log(e.code);
});

clear.addEventListener("click", () => {
  operation = null;
  firstMem = null;
  secondMem = null;
  result.innerText = "";
  temp.innerText = "";
});

clearEntry.addEventListener("click", () => {
  secondMem = null;
  result.innerText = "0";
  operationActive = true;
});

erase.addEventListener("click", () => {
  if (!operationActive) {
    let text = result.innerText;
    result.innerText = text.slice(0, text.length - 1);
    secondMem = result.innerText;
  }
});

operators.forEach((operator) => {
  operator.addEventListener("click", (e) => opKey(e.target));
});

function opKey(target) {
  if (target.getAttribute("id") === "fraction") {
    fraction();
    return;
  }
  if (target.getAttribute("id") === "squared") {
    squared();
    return;
  }
  if (target.getAttribute("id") === "root") {
    root();
    return;
  }
  firstMem && equal(operation, firstMem, secondMem);
  firstMem = Number(result.innerText);
  temp.innerText = result.innerText + target.getAttribute("symbol");
  operationActive = true;
  operation = target.getAttribute("operation");
}

percent.addEventListener("click", () => {
  if (operation === "plus" || operation == "minus") {
    result.innerText = (firstMem * result.innerText) / 100;
  } else if (operation === "times" || operation === "divide") {
    result.innerText = secondMem / 100;
  }
  temp.innerText += " " + result.innerText;
  secondMem = Number(result.innerText);
});

equals.addEventListener("click", () => {
  equal(operation, firstMem, secondMem);
  secondMem = null;
  operationActive = true;
  operation = null;
});

// Functions
function equal(operation, a, b) {
  if (!firstMem) {
    firstMem = temp.innerText = result.innerText;
    return;
  }
  if (secondMem !== null) {
    if (operation === "plus") {
      temp.innerText = a + " + " + b + "=";
      result.innerText = Number(a) + Number(b);
    } else if (operation === "minus") {
      temp.innerText = a + " - " + b + "=";
      result.innerText = Number(a) - Number(b);
    } else if (operation === "times") {
      temp.innerText = a + " x " + b + "=";
      result.innerText = Number(a) * Number(b);
    } else if (operation === "divide") {
      temp.innerText = a + " \xf7 " + b + "=";
      if (b == "0") {
        result.innerText = "Can't divide by zero";
        return;
      } else {
        result.innerText = Number(a) / Number(b);
      }
    } else if (operation === "percent") {
      let value = (Number(a) * Number(b)) / 100;
      temp.innerText = a + " \x25 " + value + "=";
      result.innerText = Number(a) / Number(value);
    }
  }
  round();
}

function negate() {
  if (!firstMem) {
    secondMem = result.innerText = result.innerText *= -1;
  } else {
    // firstMem = temp.innerText = result.innerText *= -1;
    secondMem = result.innerText *= -1;
  }
}

function fraction() {
  secondMem = Number(result.innerText);
  temp.innerText = "1/(" + result.innerText + ")";
  result.innerText = 1 / secondMem;
  round();
}

function squared() {
  secondMem = Number(result.innerText);
  temp.innerText = "sqr(" + result.innerText + ")";
  result.innerText = secondMem ** 2;
  round();
}

function root() {
  secondMem = Number(result.innerText);
  temp.innerText = "\u221a(" + result.innerText + ")";
  result.innerText = secondMem ** 0.5;
  round();
}

function round() {
  result.innerText = Math.floor(result.innerHTML * 10 ** 13) / 10 ** 13;
  if (result.innerText > 10 ** 13) {
    result.innerText = Number(result.innerHTML).toExponential(10);
  }
}
