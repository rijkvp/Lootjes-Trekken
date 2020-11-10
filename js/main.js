window.onload = (event) => {
    updatePersonForm();
};

class Person {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

function updatePersonForm() {
    console.l
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
    var persons = [];
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

    persons.sort((a, b) => (a.id > b.id) ? 1 : -1)
    
    var resultsElement = document.getElementById("resultsDiv");
    resultsElement.style.display = 'block';

    var results = document.getElementById("results");
    results.innerHTML = ""; // Clear resutls

    persons.forEach(person => {
        var resultElement = document.createElement("div");
        resultElement.className = "container my-3 p-4 text-left shadow rounded";
        resultElement.innerHTML = '<h5 class="display-6">' + person.name + '</h5><h5>' + person.selected + "</h5>";
        results.appendChild(resultElement);
    });
}