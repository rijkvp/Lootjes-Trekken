
var persons = [];
var allResultsSection;
var allResultsContainer;
var allResultsConfirmation;
var showingAllResults = false;
var personalResultsSection;
var personalResultsView;
var personalResultsSelect;
var personalResultsText;

window.onload = (event) => {
    updatePersonForm();
    
    // Hide sections
    allResultsSection = document.getElementById("allResultsSection");
    allResultsSection.style.display = "none";
    personalResultsSection = document.getElementById("personalResultsSection");
    personalResultsSection.style.display = "none";

    allResultsConfirmation = document.getElementById("allResultsConfirmation");
    allResultsContainer = document.getElementById("allResultsContainer");
    toggleAllResults(showingAllResults);

    personalResultsSelect = document.getElementById("personalResultsSelect");
    personalResultsView = document.getElementById("personalResultsView");
    personalResultsView.style.display = "none";
    personalResultsText = document.getElementById("personalResultsText");
};

class Person {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

function updatePersonForm() {
    var personList = document.getElementById("personList");
    personList.innerHTML = ""; // Clear previous

    var amount = document.getElementById("amountInput").value;

    for (var i = 1; i <= amount; i++) {
        var personElement = document.createElement("div");
        personElement.className = "personItem container my-3 p-4 text-left shadow rounded";
        personElement.innerHTML = '<h5>Persoon ' + i + '</h5><div class="input-group"><span class="input-group-text">Naam</span><input type="text" placeholder="Voer een naam in.." class="form-control personItemName"></div>';
        personList.appendChild(personElement);
    }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }
}

function execute() {
    persons.length = 0;
    var idCounter = 0;
    document.querySelectorAll('.personItem').forEach(
        personItemElement => {
            var name = personItemElement.querySelector('.personItemName').value;
            persons.push(new Person(idCounter, name));
            idCounter++;
        }
    );

    shuffleArray(persons);

    for (var i = 0; i < persons.length; i++) {
        if (i == persons.length - 1)
            var selected = persons[0].name;
        else
            var selected = persons[i + 1].name

        persons[i].selected = selected;
    }

    persons.sort((a, b) => (a.id > b.id) ? 1 : -1);

    updateResults();
}

function updateResults() {
    toggleAllResults(false);

    allResultsSection.style.display = 'block';
    personalResultsSection.style.display = 'block';
    personalResultsView.style.display = "none";

    // Clear previous resutls
    allResultsContainer.innerHTML = "";
    personalResultsSelect.innerHTML = '<option selected value="default">Kies een persoon</option>'; // Default option
    personalResultsText.innerHTML = "[NAAM HIER]";

    persons.forEach(person => {
        var resultElement = document.createElement("div");
        resultElement.className = "container my-3 p-4 text-left shadow rounded";
        resultElement.innerHTML = '<h5 class="display-6">' + person.name + '</h5><h5>' + person.selected + "</h5>";
        allResultsContainer.appendChild(resultElement);

        var optionElement = document.createElement("option");
        optionElement.setAttribute("value", person.id);
        optionElement.innerHTML = person.name;
        personalResultsSelect.appendChild(optionElement);
    });


}

function viewPersonalResult() {
    var selectedIndex = personalResultsSelect.value;
    if (selectedIndex != "default")
    {
        var selectedPerson = persons[selectedIndex];
        personalResultsText.innerHTML = selectedPerson.selected;
        personalResultsView.style.display = "block";
    }
}

function hidePersonalResult() {
    personalResultsText.innerHTML = "[NAAM HIER]";
    personalResultsView.style.display = "none";
}

function toggleAllResults(value)
{
    showingAllResults = value;
    if (showingAllResults)
    {
        allResultsConfirmation.style.display = "none";
        allResultsContainer.style.display = "block";
    } 
    else
    {
        allResultsContainer.style.display = "none";
        allResultsConfirmation.style.display = "block";
    }
}