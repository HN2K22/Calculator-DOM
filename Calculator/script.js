let firstNumber = "";
let currentNumber = "";
let operator = "";
let history = [];
let awaitingNewNumber = false; // Tracks if we are awaiting a new number after an operation

const clsHist = document.querySelector(".clsHist")
const container = document.querySelector(".masterCont")
const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".btn");
const divHolder = document.querySelector(".divHolder")

clsHist.addEventListener("click", function(e){
    history = []
    while (divHolder.firstChild) {
        divHolder.removeChild(divHolder.firstChild);
    }
})


function calcHistory(first,current,operator,result){
    first = parseFloat(first)
    current = parseFloat(current)
    result = parseFloat(result)
    const div1 = document.createElement("div")
    div1.setAttribute("class","calcHist")
    div1.append(`${first} ${operator} ${current} = ${result}`)
    history.push(div1);
    if (history.length > 10) {
        divHolder.removeChild(history[0]); // Remove the first element from the DOM
        history.shift(); // Remove the first element from the array
    }
    divHolder.append(div1)
    
}
function updateDisplay(value) {
    // Round result to 10 decimal places and display
    display.textContent = value.length > 10 ? parseFloat(value).toFixed(10) : value;
}

function clearDisplay() {
    firstNumber = '';
    currentNumber = '';
    operator = '';
    awaitingNewNumber = false;
    updateDisplay("0");
}

function operate(first, second, operator) {
    first = parseFloat(first);
    second = parseFloat(second);
    let result 
    
    switch (operator) {
        case "+":
            return first + second;
        case "-":
            return first - second;
        case "*":
            return first * second;
        case "/":
            if (second === 0) {
                return "Error: Can't Divide by Zero";  // Handle division by zero
            }
            return first / second;
        default:
            return second;
    }
return result.toFixed(10)
}

function operatorHandler(value) {
    // Prevent operator press if currentNumber is empty and no firstNumber is set
    if (currentNumber === "" && firstNumber === "") return;

    if (firstNumber === "") {
        // If first number is empty, set first number to current number and set operator
        firstNumber = currentNumber;
        operator = value;
        currentNumber = "";
    }else if(currentNumber ==""){
        operator = value
    } else if (currentNumber !== "") {
        // If both firstNumber and currentNumber are available, calculate
        firstNumber = operate(firstNumber, currentNumber, operator);  // Calculate using the operator
        operator = value; // Update operator
        currentNumber = "";  // Reset current number
        updateDisplay(firstNumber); // Display the intermediate result
    }
}

function calculate() {
    let result = "";
    
    // Ensure both firstNumber and currentNumber are not empty before calculating
    if (firstNumber !== "" && currentNumber !== "") {
        result = operate(firstNumber, currentNumber, operator);  // Perform the calculation
        calcHistory(firstNumber, currentNumber, operator, result); // Store the history

        firstNumber = result;  // Set the result as the new firstNumber
        currentNumber = "";    // Clear currentNumber for the next input
        operator = "";         // Reset operator after calculation

        awaitingNewNumber = true; // Flag to wait for a new number after operation
        updateDisplay(result || "0");
    } else if (firstNumber !== "" && currentNumber === "") {
        // If no current number, but operator exists, just show firstNumber
        operator = operatorHandler(value)
        currentNumber = numberHandler(value)
        const conjugated = operate(result,currentNumber,operator);
        calcHistory(firstNumber,currentNumber,operator,conjugated)
        currentNumber = "";
        operator = ""
        awaitingNewNumber = true;
        updateDisplay(conjugated || "0");}
}

function numberHandler(value) {
    // Prevent multiple decimal points in the same number
    if (value === '.' && currentNumber.includes('.')) return;

    // Reset if awaiting a new number after an operation
    if (awaitingNewNumber) {
        currentNumber = value;
        awaitingNewNumber = false;
    } else {
        // If the number starts with 0 and is not a decimal, replace it with the new number
        if (currentNumber === '0' && value !== '.') {
            currentNumber = value;  // Replace leading zero with the pressed number
        } else {
            currentNumber += value; // Append number to the current number
        }
    }
    updateDisplay(currentNumber);
}

// Add event listeners to each button
buttons.forEach(button => {
    button.addEventListener('click', function () {
        const value = button.getAttribute("data-value");

        if (value >= '0' && value <= '9' || value === '.') {
            // Handle number or decimal point input
            numberHandler(value);
        } else if (value === 'clear') {
            // Clear the calculator
            clearDisplay();
        } else if (value === '=') {
            // Handle equals button (calculate result)
            calculate();
        } else {
            // Handle operator input (addition, subtraction, multiplication, division)
            operatorHandler(value);
        }
    });
});
