window.addEventListener('load', async () => {
    // Get list of charachters, then create all event listeners
    let list = await getStarWarsPeopleInfo();
    createEventListeners(list);
});

async function getStarWarsPeopleInfo() {
    let loadingMessage = document.querySelector('#loading');
    let url = 'https://swapi.dev/api/people/';
    let peopleList = [];

    try {
        let success = false;

        while (true) {
            let response = await fetch(url);
            let poepleData = await response.json();

            // if response is OK, loop through it and create people objects
            // and add them to a list
            if (response.ok) {
                for (let i = 0; i < poepleData.results.length; i++) {
                    let person =
                    {
                        name: poepleData.results[i].name,
                        birth: poepleData.results[i].birth_year
                    };

                    peopleList.push(person);
                }

                // Get next url
                url = poepleData.next;

                if (poepleData.next !== null) {
                    url = url.replace('http', 'https');
                }

                // if there's no next url, break out of the loop
                if (poepleData.next == null) {
                    success = true;
                    break;
                }
            }

            // If response is not ok, show error message
            else {
                loadingMessage.innerText = "Data could not be fetched, please try again later...";
                break;
            }

        }

        if (success) {

            // If the API requests were successfull, create DOM-elements
            // and add them to the cahrachters div
            const listContainer = document.querySelector('.charachters');
            peopleList.map(x => createDomElements(x, "add"))
            .forEach(element => {
                listContainer.appendChild(element);
            });

            // Hide the loading message
            let loadingText = document.querySelector('#loading');
            loadingText.classList.add('hidden');

            // Populate the datalist in the searchbar
            addToDataList(peopleList)
            return peopleList;
        }
    }
    
    catch(error)
    {
        loadingMessage.innerText = "Data fetch completely failed";
    }

}

function addToDataList(peopleList) {
    let dataList = document.getElementById('charachter-list');

    for (let i = 0; i < peopleList.length; i++) {
        let data = document.createElement('option');
        data.value = peopleList[i].name;
        dataList.appendChild(data);
    }
}

// Create a DOM-element, creates different elements depending where it's called from
function createDomElements(person, buttonType) {
    let el = document.createElement('div');

    let heading = document.createElement('h3');
    heading.innerText = person.name;
    el.appendChild(heading);

    let content = document.createElement('span');
    content.innerText = `Birth: ${person.birth}`;
    el.appendChild(content);

    let button = document.createElement('button');

    // If the button type is "add", the DOM-element is going to the 
    // all charchers list
    if (buttonType === "add") {
        button.style.marginBottom = '1em';
        button.addEventListener('click', function () { addFromAllList(person, el) });
    }

    // If the button type is "change" the DOM-element is going to the
    // favourites list
    else if (buttonType === "change") {

        button.style.marginBottom = '1em';
        heading.addEventListener('click', function () { changeCharachter(person, el) });

        button.addEventListener('click', function () { deleteCharachter(el) });
    }

    el.appendChild(button);
    return el;
}

// Run when the add button is clicked on an element from the "charachters list"
// and add it to the favourites list
function addFromAllList(person, parent) {

    let parentSpan = parent.querySelector('span');
    let parentSpanText = parent.querySelector('span').innerText;

    parentSpan.innerText = "Added!";
    setTimeout(() => { parentSpan.innerText = parentSpanText }, 1000)

    let favouritesContainer = document.querySelector('.favourites');
    let el = createDomElements(person, "change");
    favouritesContainer.appendChild(el);
}

// Run when the h3 is clicked on an element from the favorites list
function changeCharachter(person, el) {
    let addButton = document.getElementById('add');
    let saveButton = document.getElementById('save');

    let charachterInput = document.getElementById('charachter-input');
    let birthInput = document.getElementById('birth-input');

    // Hide the add button and show the save button
    addButton.classList.add('hidden');
    saveButton.classList.remove('hidden');

    charachterInput.value = person.name;
    birthInput.value = person.birth

    // set the charachter variable to the favorite element that was clicked
    charachterElement = el;
}

// Run when the delete button is clicked
function deleteCharachter(childElement) {
    let parent = document.querySelector('.favourites');
    parent.removeChild(childElement);
}

// Create event listeners
function createEventListeners(list) {

    let addButton = document.getElementById('add');
    let saveButton = document.getElementById('save');
    let allButton = document.getElementById('all');
    let favouritesButton = document.getElementById('favourites');

    addButton.addEventListener('click', function () { addToFavorites(list) });
    saveButton.addEventListener('click', updateCharachter);

    allButton.addEventListener('click', event => {
        let allContainer = document.querySelector('.charachters');
        let favouritesContainer = document.querySelector('.favourites');

        allContainer.classList.remove('hidden');
        favouritesContainer.classList.add('hidden')

    });

    favouritesButton.addEventListener('click', event => {
        let allContainer = document.querySelector('.charachters');
        let favouritesContainer = document.querySelector('.favourites');

        allContainer.classList.add('hidden');
        favouritesContainer.classList.remove('hidden')
    });
}

let charachterElement;

// Run when the save button is clicked. It changes the favourites DOM-element(charachterElement)
// that it got from the changeCharachter function
function updateCharachter() {
    let saveButton = document.getElementById('save');
    let addButton = document.getElementById('add');

    heading = charachterElement.querySelector('h3');
    birth = charachterElement.querySelector('span');

    let charachterInput = document.getElementById('charachter-input');
    let birthInput = document.getElementById('birth-input');

    heading.innerText = charachterInput.value;
    birth.innerText = `Birth: ${birthInput.value}`;

    charachterInput.value = "";
    birthInput.value = "";

    addButton.classList.remove('hidden');
    saveButton.classList.add('hidden');
}

// Run when the add button is clicked and adds the values from the input
// to the favourites list
function addToFavorites(list) {
    let foundInList = false;
    let favouritesContainer = document.querySelector('.favourites')
    let charachterInput = document.getElementById('charachter-input');
    let birthInput = document.getElementById('birth-input');

    let charachterInputValue = charachterInput.value;
    let birthInputValue = birthInput.value;

    // If there's no value in the charachter name input, alert and return.
    if (charachterInputValue === "") {
        charachterInput.value = "";
        birthInput.value = "";
        alert("You must enter a name!");
        return;
    }

    // If the birthinput is empty, check the chachters list from the API
    // for a match and use its birth.
    if (birthInputValue === "") {
        for (let i = 0; i < list.length; i++) {

            // If found create a DOM-element with the charachter from the API
            if (list[i].name.toLowerCase() === charachterInputValue.toLowerCase()) {
                let element = createDomElements(list[i], "change");

                favouritesContainer.appendChild(element);
                foundInList = true;
            }
        }

        // If it wasn't found among the API charachter, create a new person object
        // with only a name. The birth will be "undefined"
        if (!foundInList) {
            let person =
            {
                name: charachterInputValue
            };

            let element = createDomElements(person, "change");
            favouritesContainer.appendChild(element);
        }
    }

    // If there is a charchter name input and a birth input value, create a new person
    // object with those values and add it to the favourites list
    else {

        let person =
        {
            name: charachterInputValue,
            birth: birthInputValue
        };

        let element = createDomElements(person, "change");
        favouritesContainer.appendChild(element);

    }

    charachterInput.value = "";
    birthInput.value = "";
}
