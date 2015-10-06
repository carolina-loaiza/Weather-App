//----------------------------------------------------------Varible---------------------------------------------------------//
var inputCity;
var inputCountry;
var weatherPath;
var locationPath;
var data;
var iconWeather;
var colorweather;
var newSearch;
var daysContainer;
var listContainer = document.getElementById("weather-list");
var form = document.getElementById('userForm');

//-----------------------------------------------Revealing Module-----------------------------------------------------------//

var WeatherApp = ( function( window, undefined ) {

	function getDataUser() {
		inputCity = document.getElementById("city").value;
		inputCountry = document.getElementById("country").value;
		weatherPath = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+inputCity+','+inputCountry+'&units=metric&APPID=ee9e5dae857b15a79a82cd5729c92d7a';
    loadJSON(weatherPath);
	}

  function myLocation() {
    var watchID = navigator.geolocation.getCurrentPosition(function(position) {
      locationPath = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&units=metric&APPID=ee9e5dae857b15a79a82cd5729c92d7a';
      loadJSON(locationPath);
    });
  }

  function showFrom(){
    form.classList.toggle("hidden");
    form.reset();
  }

	function loadJSON(path) { 
		var request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				data = JSON.parse(request.responseText);
				myWeatherFactory(data);
        console.log(data);
			} else {
				 console.log("We reached our target server, but it returned an error")
			}
		};
		request.onerror = function() {
			 console.log("There was a connection error of some sort")
		};
		request.send();
	}

	return {
		getClick : getDataUser,
    getmyWeather : myLocation,
    showFrom: showFrom
	};
	
} )( window );


//-----------------------------------------------Factory pattern-----------------------------------------------------------//


function myWeatherFactory(data){

	function currentWeatherCity( options ) {
    this.cod = options.cod;
    this.weather = options.weather;
		this.city = options.city;
		this.country = options.country;
    this.deg = options.deg;
		this.icon = options.icon;
		this.actualWeather = options.actualWeather;
	}

  function daysWeatherCity( options ) {
    this.cod = options.cod;
    this.weather = options.weather;
    this.nextDay = options.nextDay;
    this.afterDay = options.afterDay;
    this.afterAfterDay = options.afterAfterDay;
  }

  function makeWeather() {};
    makeWeather.prototype.createPart = function createWeatherPart( options ) {
    var parentClass = null;
    
    if( options.weather === 'current' ) {
      parentClass = currentWeatherCity;
    } else if( options.weather === '3days' ) {
      parentClass = daysWeatherCity;
    }
    
    if( parentClass === null ) {
      return false;
    }
    
    return new parentClass( options );
  }

	var currentWeatherFactory = new makeWeather();
	var currentObject = currentWeatherFactory.createPart( {
    cod: data.cod,
    weather : 'current',
    city : data.city.name,
    country : data.city.country,
    deg : data.list[0].temp.max,
    icon : data.list[0].weather[0].icon,
    actualWeather : data.list[0].weather[0].main
	} );

  var daysWeatherFactory = new makeWeather();
  var daysObject = daysWeatherFactory.createPart( {
    cod: data.cod,
    weather : '3days',
    nextDay: {
      day : data.list[1].dt,
      icon : data.list[1].weather[0].icon,
      weather : data.list[1].weather[0].main
    },
    afterDay: {
      day : data.list[2].dt,
      icon : data.list[2].weather[0].icon,
      weather : data.list[2].weather[0].main
    },
    afterAfterDay: {
      day : data.list[3].dt,
      icon : data.list[3].weather[0].icon,
      weather : data.list[3].weather[0].main
    }
  } );
  console.log(currentObject);
  //console.log(daysObject);
  showItem(currentObject);
  threeDays(daysObject);
}

// Choose icon weather //

function chooseIcon(data) {

  switch (data.icon) {
    case "01d":
      iconWeather = '<span class="icon icon-sun"></span>';
      colorweather = '#EAC14D';
      break;
    case "01n":
      iconWeather = '<span class="icon icon-moon"></span>';
      colorweather = '#48647C';
      break;
    case "02d":
      iconWeather = '<span class="icon icon-sunny-with icon-cloud"></span>';
      colorweather = '#EB866A';
      break;
    case "02n":
      iconWeather = '<span class="icon icon-night-with icon-cloud"></span>';
      colorweather = '#2C3E50';
      break;
    case "03d":
    case "03n":
      iconWeather = '<span class="icon icon-cloud-only"></span>';
      colorweather = '#3A738A';
      break;
    case "04d":
    case "04n":
      iconWeather = '<span class="icon icon-broken-cloud"></span>';
      colorweather = '#2C3E50';
      break;
    case "09d":
    case "09n":
      iconWeather = '<span class="icon basecloud-broken icon-rainy"></span>';
      colorweather = '#2C3E50';
      break;
    case "10d":
      iconWeather = '<span class="icon basecloud"></span><span class="icon icon-rainy icon-sunny"></span>';
      colorweather = '#3598DB';
      break;
    case "10n":
      iconWeather = '<span class="icon basecloud"></span><span class="icon icon-rainy icon-night"></span>';
      colorweather = '#167C80';
      break;
    case "11d":
      iconWeather = '<span class="icon basethundercloud"></span><span class="icon icon-thunder icon-sunny"></span>';
      colorweather = '#553982';
      break;
    case "11n":
      iconWeather = '<span class="icon basethundercloud"></span><span class="icon icon-thunder icon-night"></span>';
      colorweather = '#553982';
      break;
    case "13d":
      iconWeather = '<span class="icon basecloud"></span><span class="icon icon-snowy icon-sunny"></span>';
      colorweather = '#67809F';
      break;
    case "13n":
      iconWeather = '<span class="icon basecloud"></span><span class="icon icon-snowy icon-night"></span>';
      colorweather = '#34495E';
      break;
    case "50d":
    case "50n":
      iconWeather = '<span class="icon icon-mist"></span>';
      colorweather = '#95A5A5';
      break;
    default:
      iconWeather = '<span class="icon icon-cloud-only"></span>';
      colorweather = '#3A738A';
  }
  return iconWeather;
}

// Print local weather //

function showItem(data) {

	newSearch = document.createElement("li");
	newSearch.className = 'weather-content';
	contenido = '<p><span>'+data.city+'</span>, <span>'+data.country+'</span></p>'+chooseIcon(data)+'<p class="actual-weather">'+data.actualWeather+'  / <span> '+Math.round(data.deg)+'°C</span></p><ul id="'+data.cod+'" class="weather-days-content"></ul>';
  newSearch.innerHTML = contenido;
  listContainer.insertBefore(newSearch, listContainer.childNodes[0]);

  // Choose background color //

  var style = document.querySelectorAll('style')
  if (style.length != 0) {
    document.head.removeChild(style[0])
  }

  var sheet = jss.createStyleSheet({
    '.btn, .weather-content span, .actual-weather': {
      color: colorweather
    },
    'body': {
      'background-color': colorweather
    }
  }, {named: false}).attach()
}

// Change Timestamp into Date day //

function getDayOfweek(date){
  var date = new Date(date * 1000);
  var txt = date.toUTCString();
  var day = txt.slice(0, 3);
  return day;
}

// Print 3 days weather //

function threeDays(data){
  daysContainer = document.getElementById(''+data.cod+'');
  contenido = '<li><p>'+getDayOfweek(data.nextDay.day)+'</p>'+chooseIcon(data.nextDay)+'<p class="days-weather">'+data.nextDay.weather+'</p></li><li class="center"><p>'+getDayOfweek(data.afterDay.day)+'</p>'+chooseIcon(data.afterDay)+'<p class="days-weather">'+data.afterDay.weather+'</p></li><li><p>'+getDayOfweek(data.afterAfterDay.day)+'</p>'+chooseIcon(data.afterAfterDay)+'<p class="days-weather">'+data.afterAfterDay.weather+'</p></li>';
  daysContainer.innerHTML = contenido;
}

// Show local weather  //

window.onload = function() {
  WeatherApp.getmyWeather()
};



