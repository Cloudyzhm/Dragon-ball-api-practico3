const api_url = "https://dragonball-api.com/api/characters"
const charactersContainer = document.getElementById("characters")
const raceSelect = document.getElementById("raceFilter")

let allCharacters = []
const initialRaces = [
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
]
let nextPageUrl = null
let totalItems = null

const allOption = document.createElement("option")
allOption.value = "all"
allOption.textContent = "Todos"
raceSelect.appendChild(allOption)

initialRaces.forEach(race => {
    const option = document.createElement("option")
    option.value = race
    option.textContent = race
    raceSelect.appendChild(option)
})

async function fetchApi(url) {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la API: ${response.status}`)
        }
        const data = await response.json()
        nextPageUrl = data.links.next
        totalItems = data.meta.totalItems

        const newCharacters = data.items.filter(newItem =>
            !allCharacters.some(existingItem => existingItem.id === newItem.id)
        )

        allCharacters = allCharacters.concat(newCharacters)

        renderCharacters(allCharacters, raceSelect.value)
    } catch (error) {
        console.error("Error al obtener personajes:", error)
    }
}

function renderCharacters(characters, raceFilter = "all") {
    charactersContainer.innerHTML = ""

    const filteredCharacters = raceFilter === "all" ? characters :
        characters.filter(character => character.race === raceFilter)

    filteredCharacters.forEach(character => {
        const card = document.createElement("div")
        const name = document.createElement("h2")
        const image = document.createElement("img")
        const race = document.createElement("p")

        card.id = character.name
        card.classList.add("character-card")
        name.textContent = character.name
        image.src = character.image
        race.textContent = character.race

        card.appendChild(name)
        card.appendChild(image)
        card.appendChild(race)

        charactersContainer.appendChild(card)
    })
}

raceSelect.addEventListener("change", () => {
    fetchApi(`${api_url}?limit=${totalItems}`)
})

window.addEventListener("scroll", () => {
    if (!nextPageUrl) return

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const triggerPoint = scrollHeight - clientHeight

    if (scrollTop >= triggerPoint) {
        fetchApi(nextPageUrl)
    }
})

fetchApi(api_url)