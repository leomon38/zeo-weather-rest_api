require('dotenv').config()
const fetch = require("node-fetch");
const { REST_HOST_URL } = process.env;


module.exports = async function fetchWeatherData(cities, days) {
    try {
        const results = await Promise.all(
            cities.map(async (city) => {
                return fetch(`${REST_HOST_URL}weatherServices/getWeatherResult/${city}/1`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                })
        }));
        const filteredResults = results.filter(res => res.status == 200)
        return filteredResults;
    }catch (err) {
       console.log(err)
    }

}
