let superheroMenu = document.querySelector('.main-select')
let memeSuperheroMenu = document.querySelector('.meme-select')
let heroCardContainer = document.getElementById('superhero-card-container')
let heroContainer = document.querySelector('.superhero-card')
let listContainer = document.querySelector('.main-select')
let memeSelectHero = document.querySelector('.meme-select')
let welcomeBlurb = document.querySelector('.welcome-blurb-container')
let randomBtn = document.querySelector('.randomBtn')
let memeBtn = document.querySelector('.memeBtn')
let memeModal = document.querySelector('.meme-modal')
let memeModalContent = document.querySelector('.meme-modal-content')
let memeTextArea = document.getElementById('meme-input-setup')
let memeTextAreaPunchline = document.getElementById('meme-input-punchline')
let memeSubmit = document.querySelector('.meme-input')
let cancelBtn = document.querySelector('.close-modal')

const superHeroList = []
const joke = {}
let currentlySelectedHero = null
let userMemeInputText = null
let memeCharacterSelected = null

function getSuperHeroes() {
    $.ajax({
        url: "https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/all.json",
        method: "GET",
        success: function (result) {
            for (let i = 0; i < result.length; i++) {
                superHeroList.push({name: result[i].name, image: result[i].images.md, id: result[i].id})
            }
            generateDropDownList()
            superheroMenu.addEventListener('change', superheroGenerateJoke)
            randomBtn.addEventListener('click', generateRandomHero)
            memeBtn.addEventListener('click', showMemeModal)
            memeSubmit.addEventListener('click', memeCreator)
        },
        error: function(error) {
            console.error(error)
        }
    })
}
function getRandomJoke() {
    randomBtn.removeEventListener('click', generateRandomHero)
    setTimeout(function () {
        $.ajax({
            url: "https://official-joke-api.appspot.com/jokes/programming/random",
            method: "GET",
            success: function (result) {
                randomBtn.addEventListener('click', generateRandomHero)
                randomBtn.style.backgroundColor = '#fa8500'
                joke.setup = result[0].setup
                joke.punchline = result[0].punchline
            },
            error: function(error) {
                console.error(error)
                randomBtn.addEventListener('click', generateRandomHero)
                randomBtn.style.backgroundColor = '#fa8500'
                joke.setup = "Please Check Your Internet Connection"
                joke.punchline = "Error getting data"

            }
        })
    }, 1000)
    
}

function resetCard() {
    hideWelcomeBlurb()
    removeExistingCard()
    getRandomJoke()
}

function hideWelcomeBlurb() {
    welcomeBlurb.className = 'hidden welcome-blurb-container'
}

function removeExistingCard() {
    let currentDisplayedCard = document.querySelector('.superhero-card')
    if (currentDisplayedCard) {
        currentDisplayedCard.remove()
    }
}

function generateDropDownList() {
    for (let i = 0; i < superHeroList.length; i++) {
        let dropDownItem = document.createElement('option')
        dropDownItem.textContent = superHeroList[i].name
        listContainer.append(dropDownItem)
    }
    return superHeroList
}

function superheroGenerateJoke() {
        currentlySelectedHero = event.path[1].firstElementChild.value
        createHeroDomElements()
}

function generateRandomHero() {
    randomBtn.style.backgroundColor = 'lightgrey'
        let randomNumber = Math.floor(Math.random() * superHeroList.length)
        currentlySelectedHero = superHeroList[randomNumber].name
        createHeroDomElements()
        superheroMenu.value = 'Select your hero'
}

function createHeroDomElements() {
    let heroMatch = null
    for (let i = 0; i < superHeroList.length; i++) {
        if (currentlySelectedHero === superHeroList[i].name) {
            heroMatch = superHeroList[i]
            break;
        }
    }
    resetCard()
    let superheroContainer = document.createElement('div')
    superheroContainer.classList.add('superhero-card')
    let heroTitle = document.createElement('h3')
    heroTitle.classList.add('superhero-name')
    heroTitle.textContent = currentlySelectedHero
    let heroImage = document.createElement('div')
    heroImage.classList.add('image-container')
    heroImage.style.backgroundImage = "url" + "(" + `${heroMatch.image}` + ")"
    let jokeContainer = document.createElement('div')
    jokeContainer.className = 'joke-container'
    let jokeSetup = document.createElement('h4')
    jokeSetup.setAttribute('id', 'question')
    jokeSetup.textContent = joke.setup
    let jokePunchline = document.createElement('h4')
    jokePunchline.setAttribute('id', 'answer')
    jokePunchline.textContent = joke.punchline
    jokeContainer.append(jokeSetup)
    superheroContainer.append(heroTitle, heroImage, jokeContainer)
    heroCardContainer.append(superheroContainer)
    setInterval(function () {
        jokeContainer.append(jokePunchline)
    }, 0)
}

function createMeme(userInputSetup, userMeInputPunchline, selectedHero) {
    let heroMatch = null
    for (let i = 0; i < superHeroList.length; i++) {
        if (selectedHero === superHeroList[i].name) {
            heroMatch = superHeroList[i]
            break;
        }
    }
    let superheroContainer = document.createElement('div')
    resetCard()
    superheroContainer.classList.add('superhero-card')
    let heroImage = document.createElement('div')
    heroImage.classList.add('image-container')
    heroImage.style.backgroundImage = "url" + "(" + `${heroMatch.image}` + ")"
    heroImage.style.height = '450px'
    heroImage.style.width = '100%'
    heroImage.style.padding = '0px'
    heroImage.style.margin = '0px'
    let memeCaptionSetup = document.createElement('h2')
    let memeCaptionPunchline = document.createElement('h2')
    memeCaptionSetup.textContent = userInputSetup
    memeCaptionSetup.className = 'meme-caption-setup'
    memeCaptionPunchline.textContent = userMeInputPunchline
    memeCaptionPunchline.className = 'meme-caption-punchline'
    heroImage.append(memeCaptionSetup, memeCaptionPunchline)
    superheroContainer.append(heroImage)
    heroCardContainer.append(superheroContainer)
}

function memeDropDownList() {
    for (let i = 0; i < superHeroList.length; i++) {
        let dropDownItem = document.createElement('option')
        dropDownItem.textContent = superHeroList[i].name
        memeSelectHero.append(dropDownItem)
    }
}

function showMemeModal() {
    memeModal.classList.remove('hidden')
    memeDropDownList()
    cancel()
}

function checkModalUserEntryIsNotEmpty() {
    memeCharacterSelected = memeSuperheroMenu.value
    userMemeInputSetup = memeTextArea.value
    userMemeInputpunchline = memeTextAreaPunchline.value
    createMeme(userMemeInputSetup, userMemeInputpunchline, memeCharacterSelected)
    memeModal.classList.add('hidden')
}

function ifModalUserEntryIsEmpty() {
    memeSuperheroMenu.style.border = 'solid 3px red'
    memeTextArea.style.border = 'solid 3px red'
    memeModalContent.style.border = 'none'
}

function memeCreator() {
    if (memeTextArea.value && memeTextAreaPunchline.value && memeSuperheroMenu.value !== 'Select your hero') {
        checkModalUserEntryIsNotEmpty()
    } else {
        ifModalUserEntryIsEmpty()
    }
}

function cancel() {
    cancelBtn.addEventListener('click', function () {
        memeModal.classList.add('hidden')
    })
}

getSuperHeroes()
getRandomJoke()
