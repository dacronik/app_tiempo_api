
let currentemp = null;
//ingresando a la API
async function getData(){
    const promise = await fetch("https://api.openweathermap.org/data/2.5/onecall?lat=-33.45694&lon=-70.64827&exclude=minutely,houly,alerts&units=metric&lang=es&appid=30d4741c779ba94c470ca1f63045390a");
    const json = await promise.json();

    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const weatherImages = {
    Clouds: "clouds.png",
    Rain: "rain.png",
    Clear: "clear.png",
    };
    currentemp = Math.round(json.current.temp);
    
    const data = json.daily.map(day => {
        const date = new Date(day.dt * 1000);
        const dayOfWeek = days[date.getDay()];
        const image = weatherImages[day.weather[0].main];
        const minTemp = Math.round(day.temp.min);
        const maxTemp = Math.round(day.temp.max);
        const description = day.weather[0].description;
        return { dayOfWeek, image, minTemp, maxTemp,description};
    });
    return data;
}


//creando las cards
async function generateCards(){
    const container = document.getElementById('cards')
    const data = await getData();
    var cards = '';

    data.forEach(element => {
        cards +=`
        <div class="card__body">
            <div class="card__title__dias">
                <h3>${element.dayOfWeek}</h3>
            </div>
            <div class="card__image">
                <img src="assets/img/${element.image}" alt="">
            </div>
            <div class="card__temperaturas">
                <div class="card__minima">
                    <h3>min</h3>
                    <h3 id="minima">${element.minTemp}C°/</h3>
                </div>
                <div class="card__maxima">
                    <h3>Max</h3>
                    <h3 id="maxima">${element.maxTemp}C°</h3>
                </div>
            </div>
        </div> `
    });
    container.innerHTML = cards
}

//accediendo al tiempo actual
async function createTimeCurrent(){
    const titulo = document.getElementById('card__titulo');
    const timeActual = await getData();
    var card_title = '';

    timeActual.forEach(day =>{
        card_title = `
        <div class="card__title_city" id="temp_Actual">
            <h4>Santiago de Chile</h4>
            <h3 id="actual">${currentemp}C°</h3>
        </div>
        <div class="card__bajada" id="bajada">
            <h5>${day.description}</h5> 
        </div>`
    });
    titulo.innerHTML = card_title;
}



//evento del boton swich
const checkButton = document.getElementById('check');

checkButton.addEventListener('change', function(){
    (checkButton.checked) ? celcius() : fahrenheit();
})

//transformando datos Celcius a Fahrenheit
function fahrenheit(){
    const minimas = document.querySelectorAll('#minima');
    const maximas = document.querySelectorAll('#maxima');
    const actuales = document.querySelectorAll('#actual');
    minimas.forEach(function(element){
        var minimaValor = parseInt(element.textContent.replace(/[^\d]/g, ''));
        var minimaFahrenheit= Math.round((minimaValor *9/5) +32);
        
        element.textContent = minimaFahrenheit.toFixed(0) + "°F/";
    });
    maximas.forEach(function(element){
        var maximaValor = parseInt(element.textContent.replace(/[^\d]/g, ''));
        var maximaFahrenheit= Math.round((maximaValor *9/5) +32);
        
        element.textContent = maximaFahrenheit.toFixed(0) + "°F/";
    });
    actuales.forEach(function(element){
        var actualesValor = parseInt(element.textContent.replace(/[^\d]/g, ''));
        var actualesFahrenheit= Math.round((actualesValor *9/5) +32);
        
        element.textContent = actualesFahrenheit.toFixed(0) + "°F/";
    });
}

//regresando a los datos en celcius
function celcius(){
    generateCards();
    createTimeCurrent();
}


createTimeCurrent();
generateCards()
getData()