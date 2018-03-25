var app = new Vue({
    el: '#SelectTable',
    data: {
        
        initial: true,
        showmodal: true,
        zcode: '',
        type: '',   
        type1: '',
        enterzip: false,
        city: '',
        description: '',
        temperature: '',
        humidity: '',
        windspeed: '',
        visibility: '',
       
    },

    methods: {

        // Get Weather Data
        getweather: function () {
            
            if (app.type1 == '')
                app.type1 = 'current';

            app.type = '';
            app.enterzip = false;

            if (app.type1 == "current")
                 app.type = app.type1;
            else
                app.enterzip = true;

            app.showmodal = false;
            app.initial = false;
            app.fetchweather();            
        },

        
        fetchweather: function () {

            console.log("Inside Fetch");
            var appid = "appid=8e1880f460a20463565be25bc573bdc6";
                        
            if (app.type1 == "current")
            {
                console.log("Inside current location");
                var ipUrl = "https://ipinfo.io/json";
                app.httpReqIpAsync(ipUrl, appid);
            }                
            else if ((app.type1 == "specified" && app.zcode != ""))
            {
                console.log("Inside specified");
                var zipcode = app.zcode;
                var weatherApi = `http://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&${appid}`;
                app.httpReqWeatherAsync(weatherApi);
            }             
        },

            //request to ipinfo.io/json
            httpReqIpAsync: function (url, appid, callback) {
            var httpReqIp = new XMLHttpRequest();
            httpReqIp.open("GET", url, true)
            httpReqIp.onreadystatechange = function () {
               
            if (httpReqIp.readyState == 4 && httpReqIp.status == 200) {
                var jsonIp = JSON.parse(httpReqIp.responseText)
                var ip = jsonIp.ip;
                var city = jsonIp.city;
                var country = jsonIp.country;
                app.city = `${city}, ${country}`;
                var lat = jsonIp.loc.split(",")[0];
                var lon = jsonIp.loc.split(",")[1];
                console.log(lat + " " + lon)
                var weatherApi = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${appid}`;
                //calling openweathermap api function
                app.httpReqWeatherAsync(weatherApi);
            }
            
        }
                httpReqIp.send();
        },

        //request to openweathermap.com json
        httpReqWeatherAsync: function (url, callback) {

        var httpReqWeather = new XMLHttpRequest();
        httpReqWeather.open("GET", url, true);
        
        httpReqWeather.onreadystatechange = function () {
            if (httpReqWeather.readyState == 4 && httpReqWeather.status == 200) {
                app.errormsg = '';
                var jsonWeather = JSON.parse(httpReqWeather.responseText);
                console.log(jsonWeather)
               
                var weatherDesc = jsonWeather.weather[0].description;
                var id = jsonWeather.weather[0].id;
                var icon = `<i class="wi wi-owm-${id}"></i>`
                var temperature = jsonWeather.main.temp;
                var tempFaren = Math.round(1.8 * (temperature - 273) + 32)
                // console.log(tempFaren)
                var humidity = jsonWeather.main.humidity;
                var windSpeed = jsonWeather.wind.speed;
                //converting visibility to miles 
                var visibility = Math.round(jsonWeather.visibility / 1000);
                // console.log(visibility)
                //find whether is day or night
                var sunSet = jsonWeather.sys.sunset;
                var country = jsonWeather.sys.country;
                var city = jsonWeather.name;
                //sunset is 10 digits and currentDate 13 so div by 1000
                var currentDate = new Date();
                var timeNow = Math.round(currentDate / 1000);
                console.log(timeNow + "<" + sunSet + " = " + (timeNow < sunSet))
                dayNight = (timeNow < sunSet) ? "day" : "night";
                //insert into html page
                app.description = `<i id="icon-desc" class="wi wi-owm-${dayNight}-${id}"></i><p>${weatherDesc}</p>`;
                app.temperature = `${tempFaren}<i id="icon-thermometer" class="wi wi-thermometer"></i>`;
                app.humidity = `${humidity}%`;
                app.windspeed = `${windSpeed}m/h`;
                app.visibility = `${visibility} miles`;

                if (app.type1 == "specified")
                {
                    app.type = app.type1;
                    app.city = `${city}, ${country}`;
                }                                   
            }
            else {
                if (httpReqWeather.status != 200)
                    app.errormsg = 'No data found';
            }
            
            }
            httpReqWeather.send();
       

        },

        changeOption: function ()
        {
            app.showmodal = true; 
        },

        hideModal: function () {
            if (app.initial == true) {
                app.initial = false;
                app.showmodal = false;
                app.type1 = "current";
                app.getweather();
            }
            else
                app.showmodal = false;
        },
        
    },
    
});
