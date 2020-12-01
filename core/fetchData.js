require('dotenv').config()
const fetch = require("node-fetch");
const { WEATHER_URL, ZIPDATA_URL, REST_HOST_URL, MAX_REGIONS_SYNC_COUNT} = process.env


module.exports = async function fetchWeatherData(stateAbbrev) {
    try {
        await(fetch(`${REST_HOST_URL}weatherServices/deleteWeatherData`, {
            method: "DELETE"
        }));
        const responseJson = await(await fetch(`${ZIPDATA_URL}state=${stateAbbrev}`)).json();    
        //responseJson.records.map((record) => fetchWeatherDataHelper(record.fields))                 

        /**  
        *  There are around 766 zip code entries in MA. Have to limit the fetch.
        *  Otherwise will cause temporarily ban from api.weather.gov
        *  Therefore, not using map function here
        */
        const records = responseJson.records;
        for(let i = 0; i < MAX_REGIONS_SYNC_COUNT; i++) {
            await fetchWeatherDataHelper(records[i].fields);         
        }
        
    }catch (err) {
       console.log(err);
    }

}


async function fetchWeatherDataHelper(fields) {
    const {latitude, longitude, city, state, geopoint, zip} = fields; 
    try {

        const redirectedURL = await(fetch(`${WEATHER_URL}points/${latitude},${longitude}/forecast`));
        const weatherForecastJson = await(await (fetch(redirectedURL.url))).json();   
        const newData = weatherForecastJson.properties.periods.map(period => {
            return makeData(period);        
        })

        const post_data = {
            zipcode : zip,
            region : {
                city: city,                
                geopoint: geopoint,
                state: state
            },
            data : newData, 
        };  

        const response = await fetch(`${REST_HOST_URL}weatherServices/weatherSync`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(post_data)
        })
        //await response.json();
    }catch (err) {
        return err;
    }

}


function makeData(period) {
    return {
        date: period.name,
        startTime: period.startTime.substring(0, 10),
        isDaytime: period.isDaytime,
        temperature: `${period.temperature} F`,
        windInfo: `${period.windSpeed} ${period.windDirection}`,
        detailedForecast: period.detailedForecast
    }
}