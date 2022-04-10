// Selectors
const content = document.querySelector('.country-section')
const body = document.querySelector('body')
const mode = document.querySelector('.nav-mode')
const countryFilter = document.querySelector('.filter-country')
const displayMore = document.querySelector('.display-number-country')
const searchInput = document.querySelector('.search-input')
const loader = document.querySelector('.lds-ring');



// Events
mode.addEventListener('click', () => {
    body.classList.toggle('dark-mode')
})
countryFilter.addEventListener('change', filterCountry)
searchInput.addEventListener('keyup', searchCountry)



// FUNCTIONS

// Get data from RESTCOUNTRIES side and display on the page
async function getCountry() {
    try {
        loader.style.display = 'flex'
        const response = await fetch('https://restcountries.com/v2/all')
        const data = await response.json()

        loader.style.display = 'none'
        showCountry(data)
    }
    catch (err) {
        loader.style.display = 'none'
        console.log('error: ' + err.message)
        content.innerHTML = 'Something goes wrong! Please check your internet connection and try again!'
    }
}
getCountry()


// Show all the countries on the page
const showCountry = (data) => {
    const countryTab = data.slice(0, 51)
    displayCountry(content, countryTab)
    showSelectedNumberCountry(data)
}

// Function that displays elements on the page
function displayCountry(content, countryTab) {
    countryTab.forEach(country => showCountryElement(content, country))
    showDetailInformationAboutCountry(countryTab)
}


function showCountryElement(content, country) {
    const { name, population, region, flag } = country
    let { capital } = country
    if (capital === undefined) {
        capital = 'Unknown country capital'
    }
    content.innerHTML += `
        <article class="country-element">
            <figure class="img-container">
                <img src="${flag}" alt="flag of ${name}">
            </figure>
            <section class="content-section">
                <h1 class="names">${name}</h1>
                <p><strong>Population: </strong>${population}</p>
                <p><strong>Region: </strong><span>${region}</span></p>
                <p><strong>Capital: </strong>${capital}</p>
            </section>
            <div class="btn-container">
                <button class="country-btn" aria-label="show more information about country">Show detail information</button>
            </div>
        </article>
    `
}

// Show selected number of countries
const showSelectedNumberCountry = (data) => {
    const countryTab = data
    displayMore.addEventListener('change', (e) => {
        searchInput.value = ''
        const selectValue = e.target.value
        const countryElement = document.querySelectorAll('.country-element')
        switch (selectValue) {
            case '10':
                selectedNumberOfCountry(countryTab, selectValue, countryElement)
                break;
            case '50':
                selectedNumberOfCountry(countryTab, selectValue, countryElement)
                break;
            case '100':
                selectedNumberOfCountry(countryTab, selectValue, countryElement)
                break;
            case 'All':
                countryElement.forEach(element => {
                    element.remove()
                })
                displayCountry(content, countryTab)
                break;
        }
    })
}
// function to switch statement in showSelectedNumberCountry function
function selectedNumberOfCountry(countryTab, selectValue, countryElement) {
    countryFilter.children[0].removeAttribute('selected')

    let newCountryTab = countryTab.slice(0, selectValue)
    countryElement.forEach(element => element.remove())

    countryFilter.children[0].setAttribute('selected', '')


    displayCountry(content, newCountryTab)
}


// Filter elements by region
function filterCountry(e) {
    const countryElements = document.querySelectorAll('.country-element')
    countryElements.forEach(country => {
        const region = country.children[1].children[2].children[1].textContent
        switch (e.target.value) {
            case 'All':
                country.style.display = 'grid'
                break;
            case 'Africa':
                showCountryByRegion(country, region, 'Africa')
                break;
            case 'Americas':
                showCountryByRegion(country, region, 'Americas')
                break;
            case 'Asia':
                showCountryByRegion(country, region, 'Asia')
                break;
            case 'Europe':
                showCountryByRegion(country, region, 'Europe')
                break;
            case 'Oceania':
                showCountryByRegion(country, region, 'Oceania')
                break;
            case 'Polar':
                showCountryByRegion(country, region, 'Polar')
                break;
        }
    })
}
// Function to switch statement in filterCountry function that display or hide elements base on region
function showCountryByRegion(country, region, caseName) {
    searchInput.value = ''
    region === caseName ? country.style.display = 'grid' : country.style.display = 'none'
}


// Input searchCountry function
function searchCountry() {
    const searchInput = document.querySelector('#searchInput')
    const filter = searchInput.value.toLowerCase()
    const listItem = document.querySelectorAll('.names')

    countryFilter.children[0].removeAttribute('selected')
    countryFilter.children[0].setAttribute('selected', '')


    listItem.forEach(item => {
        let parentElement = item.parentElement.parentElement
        let countryName = item.textContent
        if (countryName.toLowerCase().includes(filter)) {
            parentElement.style.display = 'grid'
        }
        else {
            parentElement.style.display = 'none'
        }
    })
}


// Function that shows detailed information about a particular country
function showDetailInformationAboutCountry(countryTab) {

    const countryBtn = document.querySelectorAll('.country-btn')

    countryBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mainContainer = document.querySelector('#main')
            const sectionInfo = document.querySelector('.country-specific-info')
            mainContainer.style.display = 'none'
            sectionInfo.style.display = 'block'

            const countryName = e.target.parentElement.parentElement.children[1].children[0].textContent
            countryTab.forEach(dataCountry => {
                let { name, flag, nativeName, population, region, subregion, topLevelDomain, languages, borders, capital, currencies } = dataCountry

                if (name === countryName) {

                    // show message 'Unknown....' if something is undefined
                    borders === undefined ? borders = 'Unknown country borders' : borders
                    capital === undefined ? capital = 'Unknown country capital' : capital
                    let currency
                    currencies === undefined ? currency = 'Unknown country currencies' : currency = currencies.map(item => item.name)

                    const language = languages.map(item => item.name)

                    // create section info content
                    sectionInfo.innerHTML = ` 
                        <button class="back-btn" aria-label="back to main side of page"><i class="fa-solid fa-arrow-left-long"></i> Back</button>
                        <div class="content-container">
                            <figure class="flag-container">
                               <img src="${flag}"/>
                            </figure>
                            <section class="info-content">
                                <h1>${name}</h1>
                                <div class="article-container">
                                    <article class="info-description">
                                        <p><strong>Native Name: </strong>${nativeName}</p>
                                        <p><strong>Population: </strong>${population}</p>
                                        <p><strong>Region: </strong>${region}</p>
                                        <p><strong>Sub Region: </strong>${subregion}</p>
                                        <p><strong>Capital: </strong>${capital}</p>
                                    </article>
                                    <article class="info-description">
                                        <p><strong>Top level Domain: </strong>${topLevelDomain}</p>
                                        <p><strong>Currencies: </strong>${currency}</p>
                                        <p><strong>Languages: </strong>${language}</p>
                                    </article>
                                </div>
                                <section class="border-container">
                                    <h1>Border Countries:</h1>
                                    <div>${borders}</div>
                                </section>
                            </section>
                        </div>
                    `
                }
            })

            const backBtn = document.querySelector('.back-btn')
            backBtn.addEventListener('click', () => {
                mainContainer.style.display = 'block'
                sectionInfo.style.display = 'none'
            })
        })
    })
}