const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessConatiner = document.querySelector(".grant-location-conatiner");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
let curr_tab = "user";
let loc_grant = 0;
const API_KEY = "e2dfa5eba9e0274f327ae079a5b3ee50";
console.log("Start");
getfromSessionStorage();


function handleTab(clickedTab){
    if(clickedTab == curr_tab && clickedTab == 'user'){
        console.log("Do Nothing");
        userInfoContainer.classList.add("hide");

        getfromSessionStorage();
    }
    else if(clickedTab == curr_tab && clickedTab == 'search'){
        userInfoContainer.classList.add("hide");
        searchForm.classList.remove("hide");
        console.log("Do Nothing");
    }
    else{
        if(curr_tab == "user"){
            userTab.classList.remove("curr");
            searchTab.classList.add("curr");
            curr_tab = "search";
            console.log("Move to Search Tab");
            userInfoContainer.classList.add("hide");
            grantAccessConatiner.classList.add("hide");
            searchForm.classList.remove("hide");
        }
        else{
            curr_tab = "user";
            userTab.classList.add("curr");
            searchTab.classList.remove("curr");
            searchForm.classList.add("hide");
            if(loc_grant == 1){
                console.log("Your Weather Is");
                grantAccessConatiner.classList.add("hide");
                userInfoContainer.classList.add("hide");
                getfromSessionStorage()
                
            }
            else{
                console.log("Grant Not Access");
                grantAccessConatiner.classList.remove("hide");
                userInfoContainer.classList.add("hide");
                getfromSessionStorage();
            }
        }
    }
}

function getfromSessionStorage(){
    const localCordinates = sessionStorage.getItem("user-coordinates");

    if(!localCordinates){
        grantAccessConatiner.classList.remove("hide");
    }
    else{
        loc_grant = 1;
        const coordinate = JSON.parse(localCordinates);
        fetchUserweatherInfo(coordinate);
    }
}

async function fetchUserweatherInfo(coordinate){
    let {lat , lon} = coordinate;
    grantAccessConatiner.classList.add("hide");
    loadingScreen.classList.remove("hide");
    let data;
    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);    
        data  = await response.json();

        console.log(data);
    }catch(err){
        loadingScreen.classList.add("hide");
        grantAccessConatiner.classList.remove("hide");
        console.log(err);
    }
    loadingScreen.classList.add("hide");
    grantAccessConatiner.classList.add("hide");
    userInfoContainer.classList.remove("hide");
    renderWeatherInfo(data);
}

function renderWeatherInfo(data){
    const cityName = document.querySelector("[data-cityName]");
    const countryicon = document.querySelector("[data-country-icon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weather-icon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloud]");

    cityName.innerText = undefined;
    countryicon.src = undefined;
    desc.innerText = undefined;
    weatherIcon.src = undefined;
    temp.innerText = undefined;
    windspeed.innerText = undefined;
    humidity.innerText = undefined;
    cloud.innerText = undefined;

    cityName.innerText = data?.name;
    countryicon.src = `https://flagcdn.com/144x108/${data?.sys.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText =(Math.trunc((data?.main?.temp - 273.15)*100))/100+ " °C";
    windspeed.innerText = data?.wind?.speed+" m/s";
    humidity.innerText = data?.main?.humidity+"%";
    cloud.innerText = data?.clouds?.all+"%";
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geolocation Support Here");
    }
}

function showPosition(position){
    const userCoordinate ={
    lat : position.coords.latitude,
    lon : position.coords.longitude}

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinate));
    fetchUserweatherInfo(userCoordinate);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" , getLocation);

let searchInput = document.querySelector("[data-searchInput]");
let searchbutton = document.querySelector("[search-city]");


searchbutton.addEventListener("click",(e)=>{
    e.preventDefault();
    console.log(searchInput.value); 
    let city = searchInput.value;
    if(searchInput.value === "") return;
    else{
    searchInput.value = "";
    fetchSearchweatherInfo(city);
    }
})

async function fetchSearchweatherInfo(city){
        loadingScreen.classList.remove("hide");
        userInfoContainer.classList.add("hide");
        grantAccessConatiner.classList.add("hide");

        try{
            let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
            const data = await response.json();
            loadingScreen.classList.add("hide");
            console.log("Weather data: ", data);
            searchForm.classList.add("hide");
            userInfoContainer.classList.remove("hide");
    
            renderWeatherInfo(data);
        
            
        }catch(err){
            console.log("Not Found");
            alert("Not Found");
        }
}
