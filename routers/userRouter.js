
const express = require('express')
const router = express.Router();
const Weather = require('../models/weatherDataModel')
const UserInfo = require('../models/userModel')
const fetchWeatherData = require('../core/fetchWeatherData')
const jsonToText = require('../core/jsonToText')

const MAX_FAVORITE_CITIES_COUNT = 7;

/**
 *  Just indicate this is for User Management
 */
router.get('/', (req, res) => {
    res.send("Simple User Service for Weather")
})


/**
 *  Save username with theirfavorite cities
 *  up to 7 cities you can save 
 * 
*/
router.post('/saveRegion', async (req, res) => {    
    const {username, zipcode} = req.body;

    let userData = await UserInfo.find({username: username});
    if(userData.length == 0) {
        userData = new UserInfo({
            username: username,
            favoriteCities: [zipcode]
        })
        const savedInfo = await userData.save();
        res.send({
            success: true,
            message: savedInfo
        });
    }else{
        let cities = userData[0].favoriteCities;
        const citySet = new Set(cities);
        if(citySet.has(zipcode)) {
            res.status(200).json({
                success: true,
                message: "this city already in your favorite"
            })
        }else {
            cities.unshift(zipcode);
            if(cities.lenght > MAX_FAVORITE_CITIES_COUNT) {
                cities.pop();
            }
            userData[0].favoriteCities = cities;
            const savedInfo = await userData[0].save();
            res.status(200).json({
                success: true,
                message: savedInfo
            })
        }
    }
})

/**
 * Get Weather With User perference
 */
router.get('/UserPrefWeather/:username/:days', async (req, res) => { 
    let params = req.params;   
    const isJson = req.headers['content-type'] == "application/json" ? true : false;          
    const {username, days} = params;

    try {
        const userData = await UserInfo.find({username: username});
        let cities = userData[0].favoriteCities;
        const results = await fetchWeatherData(cities, days);

        if(isJson) {
            const resultJson = await Promise.all(results.map(async result => result.json()))
            res.status(200).json(resultJson);
        }
        else {
            let plainResult = await Promise.all(results.map(async result => jsonToText(await result.json())));
            res.status(200).send(plainResult.reduce( (accu , result) => {
                return accu = `${accu} '\n' ${result}`
            }));
        }


    }catch(err) {
        res.status(500).json({
            success: false,
            message: {
                customMessage: 'User Not Found.. ',
                detail: err.message
            }
        })
    }
})



module.exports = router