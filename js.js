window.addEventListener('load', async () => {
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

            if (response.ok) {
                for (let i = 0; i < poepleData.results.length; i++) {
                    let person =
                    {
                        name: poepleData.results[i].name,
                        birth: poepleData.results[i].birth_year
                    };

                    peopleList.push(person);
                }

                url = poepleData.next;

                if (poepleData.next !== null) {
                    url = url.replace('http', 'https');
                }

                if (poepleData.next == null) {
                    success = true;
                    break;
                }
            }

            else {
                loadingMessage.innerText = "Data could not be fetched, please try again later...";
                break;
            }

        }

        if (success) {

            const listContainer = document.querySelector('.charachters');
            peopleList.map(x => createDomElements(x, "add"))
            .forEach(element => {
                listContainer.appendChild(element);
            });

            let loadingText = document.querySelector('#loading');
            loadingText.classList.add('hidden');

            addToDataList(peopleList)
            return peopleList;
        }
    }

    catch
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

function createDomElements(person, buttonType) {
    let el = document.createElement('div');

    let heading = document.createElement('h3');
    heading.innerText = person.name;
    el.appendChild(heading);

    let content = document.createElement('span');
    content.innerText = `Birth: ${person.birth}`;
    el.appendChild(content);

    let button = document.createElement('button');

    if (buttonType === "add") {
        button.style.marginBottom = '1em';
        button.addEventListener('click', function () { addFromAllList(person, el) });
    }

    else if (buttonType === "change") {

        button.style.marginBottom = '1em';
        heading.addEventListener('click', function () { changeCharachter(person, el) });

        button.addEventListener('click', function () { deleteCharachter(el) });
    }

    el.appendChild(button);
    return el;
}

function addFromAllList(person, parent) {

    let parentSpan = parent.querySelector('span');
    let parentSpanText = parent.querySelector('span').innerText;

    parentSpan.innerText = "Added!";
    setTimeout(() => { parentSpan.innerText = parentSpanText }, 1000)

    let favouritesContainer = document.querySelector('.favourites');
    let el = createDomElements(person, "change");
    favouritesContainer.appendChild(el);
}

function changeCharachter(person, el) {
    let addButton = document.getElementById('add');
    let saveButton = document.getElementById('save');

    let charachterInput = document.getElementById('charachter-input');
    let birthInput = document.getElementById('birth-input');

    addButton.classList.add('hidden');
    saveButton.classList.remove('hidden');

    charachterInput.value = person.name;
    birthInput.value = person.birth

    charachterElement = el;
}

function deleteCharachter(childElement) {
    let parent = document.querySelector('.favourites');
    parent.removeChild(childElement);
}

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

function addToFavorites(list) {
    let foundInList = false;
    let favouritesContainer = document.querySelector('.favourites')
    let charachterInput = document.getElementById('charachter-input');
    let birthInput = document.getElementById('birth-input');

    let charachterInputValue = charachterInput.value;
    let birthInputValue = birthInput.value;

    if (charachterInputValue === "") {
        charachterInput.value = "";
        birthInput.value = "";
        alert("You must enter a name!");
        return;
    }

    if (birthInputValue === "") {
        for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase() === charachterInputValue.toLowerCase()) {
                let element = createDomElements(list[i], "change");

                favouritesContainer.appendChild(element);
                foundInList = true;
            }
        }

        if (!foundInList) {
            let person =
            {
                name: charachterInputValue
            };

            let element = createDomElements(person, "change");
            favouritesContainer.appendChild(element);
        }
    }

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
