var persons = [];

var executeButton;

var allResultsSection;
var allResultsContainer;
var allResultsConfirmation;
var allResultsView;

var showingAllResults = false;
var amountPeople;
var validInput = false;

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
        this.isSelected = false;
        this.selectedId = null;
        this.selectedName = null;
        this.disapproves = [];
    }
}

function clearResults() {
    toggleAllResults(false);

    allResultsSection.style.display = 'none';
    personalResultsSection.style.display = 'none';
    personalResultsView.style.display = "none";

    // Clear previous resutls
    allResultsContainer.innerHTML = "";
    personalResultsSelect.innerHTML = '<option selected value="default">Kies een persoon</option>'; // Default option
    personalResultsText.innerHTML = "[NAAM HIER]";
}

function inputChange() {
    updatePersonInput();
}

function updatePersonForm() {
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
    // Simple algorithm
    // for (var i = 0; i < persons.length; i++) {
    //     var options = persons.filter(function (p) {
    //         return p.id != persons[i].id && !p.isSelected && p.selectedId != persons[i].id;
    //     });

    //     var randomIndex = Math.floor(Math.random() * options.length);
    //     var target = options[randomIndex];
    //     persons[i].selectedName = target.name;
    //     persons[i].selectedId = target.id;
    //     target.isSelected = true;
    // }

    // More complex algorithm
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
        console.log("Prefered: " + preferedOptions.length + " Other " + options.length);
        if (preferedOptions.length > 0) {
            var randomIndex = Math.floor(Math.random() * preferedOptions.length);
            var target = preferedOptions[randomIndex];
        }
        else {
            console.log("Unprefered!")
            var randomIndex = Math.floor(Math.random() * options.length);
            var target = options[randomIndex];
        }
        persons[i].selectedName = target.name;
        persons[i].selectedId = target.id;
        target.isSelected = true;
    }

    updateResults();
}

function updateResults() {
    clearResults();

    allResultsSection.style.display = 'block';
    personalResultsSection.style.display = 'block';

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