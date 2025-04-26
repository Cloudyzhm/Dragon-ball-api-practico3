const api_url = "https://dragonball-api.com/api/characters"
const charactersContainer = document.getElementById("characters")
const raceSelect = document.getElementById("raceFilter")
let allCharacters = []

async function fetchCharacters() {
    try {
        const response = await fetch(api_url)
        if (!response.ok) {
            charactersContainer.innerHTML = `<p>API status: ${response.status}</p>`
            return
        }
        const data = await response.json()
        allCharacters = data.items

        populateRaceFilter(allCharacters)
        renderCharacters(allCharacters)
    } catch (error) {
        console.error("Error al obtener personajes:", error)
    }
}

function renderCharacters(characters, raceFilter = null) {
    charactersContainer.innerHTML = ""

    if (raceFilter) {
        characters = characters.filter(character => character.race === raceFilter)
    }

    characters.forEach(character => {
        charactersContainer.innerHTML += `
            <div class="character-card">
                <h2>${character.name}</h2>
                <img src="${character.image}" alt="${character.name}">
                <p>Raza: ${character.race}</p>
            </div>
        `
    })
}

function populateRaceFilter(characters) {
    const races = []

    characters.forEach(c => {
        if (!races.includes(c.race)) {
            races[races.length] = c.race
        }
    })

    races.forEach(race => {
        const option = document.createElement("option")
        option.innerHTML = `
            <option value="${race}">${race}</option>
        `

        option.value = race
        option.textContent = race
        raceSelect.appendChild(option)
    })
}

raceSelect.addEventListener("change", () => {
    const selectedRace = raceSelect.value
    renderCharacters(allCharacters, selectedRace === "all" ? null : selectedRace)
})

fetchCharacters()
