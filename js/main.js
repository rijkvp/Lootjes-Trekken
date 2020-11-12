var persons = [];

var executeButton;

var allResultsSection;
var allResultsContainer;
var allResultsConfirmation;
var allResultsView;

var showingAllResults = false;
var amountPeople;
var validInput = false;
var disapprovesPossible = false;

var disapprovesWarning;

var personalResultsSection;
var personalResultsView;
var personalResultsSelect;
var personalResultsText;

window.onload = (event) => {
    // Hide sections
    allResultsSection = document.getElementById("allResultsSection");
    allResultsSection.style.display = "none";

    personalResultsSection = document.getElementById("personalResultsSection");
    personalResultsSection.style.display = "none";

    executeButton = document.getElementById("executeButton");
    executeButton.disabled = !validInput;

    allResultsConfirmation = document.getElementById("allResultsConfirmation");
    allResultsContainer = document.getElementById("allResultsContainer");
    allResultsView = document.getElementById("allResultsView");

    disapprovesWarning = document.getElementById("disapprovesWarning");
    disapprovesWarning.style.display = "none";

    personalResultsSelect = document.getElementById("personalResultsSelect");
    personalResultsView = document.getElementById("personalResultsView");
    personalResultsView.style.display = "none";
    personalResultsText = document.getElementById("personalResultsText");


    updatePersonForm();
};

class Person {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.disapproves = [];
        
        this.clear();
    }

    clear() {
        this.isSelected = false;
        this.selectedId = null;
        this.selectedName = null;
    }
}

function clearOutput() {
    toggleAllResults(false);

    allResultsSection.style.display = 'none';
    personalResultsSection.style.display = 'none';
    personalResultsView.style.display = "none";

    allResultsContainer.innerHTML = "";
    personalResultsSelect.innerHTML = '<option selected value="default">Kies een persoon</option>'; // Default option
    personalResultsText.innerHTML = "[NAAM HIER]";
    disapprovesWarning.style.display = "none";
}

function clearResults()
{
    persons.forEach(p => p.clear());
}

function inputChange() {
    updatePersonInput();
}

function updatePersonForm() {
    clearOutput();
    clearResults();

    var personList = document.getElementById("personList");
    personList.innerHTML = ""; // Clear previous

    amountPeople = document.getElementById("amountInput").value;

    for (var i = 1; i <= amountPeople; i++) {
        var personElement = document.createElement("div");
        personElement.className = "personItem container my-3 p-4 text-left shadow rounded";
        personElement.innerHTML = '<h5>Persoon ' + i + '</h5><div class="input-group mb-3"><span class="input-group-text">Naam</span><input type="text" placeholder="Voer een naam in.." class="form-control personItemName" oninput="inputChange()"></div><div class="input-group"><span class="input-group-text">Afkeur</span><select class="disapproves-select form-select" oninput="inputChange()" multiple></select></div>';
        personList.appendChild(personElement);
    }
}

function updatePersonInput() {
    persons.length = 0;
    var idCounter = 0;
    document.querySelectorAll('.personItem').forEach(
        personItemElement => {
            var name = personItemElement.querySelector('.personItemName').value;
            if (name != null && name != "") {
                persons.push(new Person(idCounter, name));
                idCounter++;
            }
        }
    );

    validInput = (persons.length == amountPeople);
    executeButton.disabled = !validInput;

    var idCounter = 0;
    document.querySelectorAll('.personItem').forEach(
        personItemElement => {
            var disapprovesSelect = personItemElement.querySelector('.disapproves-select');
            const selectedValues = [...disapprovesSelect.options]
                .filter((x) => x.selected)
                .map((x) => x.value);
            disapprovesSelect.innerHTML = "";
            persons.forEach(p => {
                if (p.id != idCounter) {
                    var option = document.createElement("option");
                    option.setAttribute("value", p.id);
                    if (selectedValues.includes(p.id.toString())) {
                        option.selected = true;
                    }
                    option.innerHTML = p.name;
                    disapprovesSelect.appendChild(option);
                }
            });
            if (validInput) {
                persons[idCounter].disapproves = [...selectedValues].map((x) => parseInt(x));
            }
            idCounter++;
        }
    );
}

function execute() {
    clearResults();

    // The algorithm
    disapprovesPossible = true;
    for (var i = 0; i < persons.length; i++) {
        var options = persons.filter(function (p) {
            return p.id != persons[i].id && !p.isSelected && p.selectedId != persons[i].id;
        });
        var preferedOptions = [];
        options.forEach(p => {
            if (!persons[i].disapproves.includes(p.id)) {
                preferedOptions.push(p);
            }
        });
        if (preferedOptions.length > 0) {
            var randomIndex = Math.floor(Math.random() * preferedOptions.length);
            var target = preferedOptions[randomIndex];
        }
        else {
            var randomIndex = Math.floor(Math.random() * options.length);
            var target = options[randomIndex];
            disapprovesPossible = false;
        }
        persons[i].selectedName = target.name;
        persons[i].selectedId = target.id;
        target.isSelected = true;
    }

    updateResults();
}

function updateResults() {
    clearOutput();

    allResultsSection.style.display = 'block';
    personalResultsSection.style.display = 'block';
    disapprovesWarning.style.display = !disapprovesPossible ? "block" : "none";
    persons.forEach(person => {
        var resultElement = document.createElement("div");
        resultElement.className = "container my-3 p-4 text-left shadow rounded";
        resultElement.innerHTML = '<h5 class="display-6">' + person.name + '</h5><h5>' + person.selectedName + "</h5>";
        allResultsContainer.appendChild(resultElement);

        var optionElement = document.createElement("option");
        optionElement.setAttribute("value", person.id);
        optionElement.innerHTML = person.name;
        personalResultsSelect.appendChild(optionElement);
    });
}

function viewPersonalResult() {
    var selectedIndex = personalResultsSelect.value;
    if (selectedIndex != "default") {
        var selectedPerson = persons[selectedIndex];
        personalResultsText.innerHTML = selectedPerson.selectedName;
        personalResultsView.style.display = "block";
    }
}

function hidePersonalResult() {
    personalResultsText.innerHTML = "[NAAM HIER]";
    personalResultsView.style.display = "none";
}

function toggleAllResults(value) {
    showingAllResults = value;
    if (showingAllResults) {
        allResultsView.style.display = "block";
        allResultsConfirmation.style.display = "none";
    }
    else {
        allResultsView.style.display = "none";
        allResultsConfirmation.style.display = "block";
    }
}