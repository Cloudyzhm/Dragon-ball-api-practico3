const api_url = "https://dragonball-api.com/api/characters";
const charactersContainer = document.getElementById("characters");
const raceSelect = document.getElementById("raceFilter");

let allCharacters = [];
const allRaces = [
    "Saiyan",
    "Namekian",
    "Human",
    "Frieza Race",
    "Android",
    "Majin",
    "God",
    "Angel",
    "Unknown",
    "Jiren Race",
    "Evil",
    "Nucleico benigno",
    "Nucleico"
];
let nextPageUrl = null;

// Agregar opción "Todos" al cargar
const allOption = document.createElement("option");
allOption.value = "all";
allOption.textContent = "Todos";
raceSelect.appendChild(allOption);

async function fetchApi(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
        }
        const data = await response.json();
        nextPageUrl = data.links.next;
        allCharacters = [...allCharacters, ...data.items];

        renderCharacters(allCharacters, raceSelect.value);
    } catch (error) {
        console.error("Error al obtener personajes:", error);
    }
}

function renderCharacters(characters, raceFilter = "all") {
    charactersContainer.innerHTML = "";

    const filteredCharacters = raceFilter === "all" ? characters :
    characters.filter(character => character.race === raceFilter);

    filteredCharacters.forEach(character => {
        const card = document.createElement("div");
        const name = document.createElement("h2");
        const image = document.createElement("img");
        const race = document.createElement("p");

        card.id = character.name;
        card.classList.add("character-card");
        name.textContent = character.name;
        image.src = character.image;
        race.textContent = `Raza: ${character.race}`;

        card.appendChild(name);
        card.appendChild(image);
        card.appendChild(race);

        charactersContainer.appendChild(card);
    });
}

raceSelect.addEventListener("change", () => {
    renderCharacters(allCharacters, raceSelect.value);
});

window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const triggerPoint = scrollHeight * 0.5;

    if ((scrollTop + windowHeight) >= triggerPoint && nextPageUrl !== null) {
        fetchApi(nextPageUrl);
    }
});


allRaces.forEach(race => {
    const option = document.createElement("option");
    option.value = race;
    option.textContent = race;
    raceSelect.appendChild(option);
});

fetchApi(api_url);
