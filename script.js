let debug = true;
let log = (message) => {
    if (debug) {
        console.log(message);
    } else {
        console.log("Debug is inactive!");
    }
};
log("Debug is active!");

// 🔹 Stocare date globale
let totalArea = 0;
let areaRecords = [];
let inputValues = [];

log(`Total area is: ${totalArea}`);
log(`Area records: ${JSON.stringify(areaRecords)}`);
log(`Input values: ${JSON.stringify(inputValues)}`);

// 🔹 Elemente DOM
const knowTotalBtn = document.getElementById("know-total");
const dontKnowTotalBtn = document.getElementById("dont-know-total");
const formElement =document.getElementById("form-element");
const totalAreaInput = document.getElementById("total-area-input");
const totalAreaField = document.getElementById("total-area");
const confirmTotalBtn = document.getElementById("confirm-total-area");
const shapeSelect = document.getElementById("shape-select");
const shapeSelection = document.getElementById("shape-selection");
const recordList = document.getElementById("record-list");
const totalSurfaceArea = document.getElementById("total-surface-area");

// 🔹 Obiect cu formulele pentru fiecare formă geometrică
const areaFormulas = {
    Rectangle: (length, width) => length * width,
    Triangle: (base, height) => 0.5 * base * height,
    Circle: (radius) => Math.PI * radius ** 2,
    Trapezoid: (sideA, sideB, height) => 0.5 * (sideA + sideB) * height,
};

// 🔹 Obiect cu numărul de inputuri necesare pentru fiecare formă
const shapeInputs = {
    Rectangle: ["Lungime", "Lățime"],
    Triangle: ["Bază", "Înălțime"],
    Circle: ["Rază"],
    Trapezoid: ["Latura mică", "Latura mare", "Înălțime"]
};

// 🔹 Butoane pentru utilizator
knowTotalBtn.addEventListener("click", () => {
    totalAreaInput.classList.remove("hidden");
    shapeSelection.classList.add("hidden");
});

dontKnowTotalBtn.addEventListener("click", () => {
    shapeSelection.classList.remove("hidden");
    totalAreaInput.classList.add("hidden");
});

// 🔹 Confirmarea suprafeței totale
confirmTotalBtn.addEventListener("click", () => {
    let area = parseFloat(totalAreaField.value);
    if (!isNaN(area) && area > 0) {
        totalArea = area;
        totalSurfaceArea.textContent = `${totalArea} m²`;
        log(`Confirmed total area: ${totalArea}`);
    } else {
        alert("Introduceți o suprafață validă!");
    }
});

// 🔹 Generarea formularului pentru forma selectată
shapeSelect.addEventListener("change", () => {


    let selectedShape = shapeSelect.options[shapeSelect.selectedIndex].getAttribute("data-value");
    if (!selectedShape) return;

    log(`Selected shape: ${selectedShape}`);

    // Curăță lista de înregistrări anterioare
    // recordList.innerHTML = "";

    let newForm = document.createElement("li");
    newForm.className = "record";
    newForm.innerHTML = `<h3>${shapeSelect.selectedOptions[0].text}</h3>`;

    let inputFields = generateShapeForm(selectedShape, newForm);
    let addButton = document.createElement("button");
    addButton.textContent = "Adaugă înregistrare";
    addButton.addEventListener("click",
        ()=> addRecord(selectedShape, inputFields));

    newForm.appendChild(addButton);

        // Afișează formularul (elimină clasa hidden)
    newForm.classList.remove("hidden");

    formElement.appendChild(newForm);

});

// 🔹 Creează inputuri dinamice în funcție de forma selectată
function generateShapeForm(shape, container) {
    let inputFields = [];
    shapeInputs[shape].forEach((labelText) => {
        log(`Label text is: ${labelText}`);
        let input = document.createElement("input");
        input.type = "number";
        input.className = "shape-input";
        input.placeholder = `${labelText} (m)`;
        input.required = true;
        inputFields.push(input);

        container.appendChild(document.createTextNode(labelText + "  : "));
        container.appendChild(input); 
        container.appendChild(document.createElement("br"));
    });
    return inputFields;
}

// 🔹 Extrage valorile din inputuri și le salvează global
function getInputValues(inputFields) {
    inputValues.length = 0; // Șterge datele anterioare
    inputFields.forEach(input => inputValues.push(parseFloat(input.value) || 0));

    log(`Extracted input values: ${JSON.stringify(inputValues)}`);
}

// 🔹 Adaugă o nouă înregistrare și actualizează aria totală
// 🔹 Generarea formularului pentru forma selectată
shapeSelect.addEventListener("change", () => {
    let selectedShape = shapeSelect.options[shapeSelect.selectedIndex].getAttribute("data-value");
    if (!selectedShape) return;

    log(`Selected shape: ${selectedShape}`);

    // Curăță conținutul anterior al formularului
    const formElement = document.getElementById("form-element");
    formElement.innerHTML = "";

    // Creează un nou formular
    let newForm = document.createElement("div");
    newForm.className = "record";
    newForm.innerHTML = `<h3>${shapeSelect.selectedOptions[0].text}</h3>`;

    let inputFields = generateShapeForm(selectedShape, newForm);
    let addButton = document.createElement("button");
    addButton.textContent = "Adaugă înregistrare";
    addButton.addEventListener("click", () => addRecord(selectedShape, inputFields));

    newForm.appendChild(addButton);

    // Afișează formularul (elimină clasa hidden)
    newForm.classList.remove("hidden");

    // Adaugă formularul în containerul dedicat (deasupra listei de înregistrări)
    formElement.appendChild(newForm);
});

// 🔹 Adaugă o nouă înregistrare și actualizează aria totală
function addRecord(shape, inputFields) {
    getInputValues(inputFields);

    if (inputValues.some(val => val <= 0)) {
        alert("Introduceți valori valide!");
        return;
    }

    let area = areaFormulas[shape](...inputValues);
    updateTotalArea(area, shape);

    // Ascunde formularul după adăugare
    const formElement = document.getElementById("form-element");
    formElement.innerHTML = ""; // Ascunde formularul prin ștergerea conținutului

    // Resetează input-urile
    inputFields.forEach(input => (input.value = ""));
    // Resetează elementul select
    shapeSelect.value = "";
}
    

// 🔹 Actualizează suprafața totală și adaugă înregistrarea în listă
function updateTotalArea(area, shape) {

    let valuesText = inputValues.map(value => `${value}m`).join(" x ");

    let li = document.createElement("li");
    li.className = "record";
    li.textContent = `${shape} (${valuesText}) :   ${area.toFixed(2)} m²`;
    recordList.appendChild(li);

    totalArea += area;
    totalSurfaceArea.textContent = totalArea.toFixed(2) + " m²";

    log(`Updated total area: ${totalArea}`);
}


