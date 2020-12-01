const express = require('express')
const router = express.Router();
const Weather = require('../models/weatherDataModel')
const UpdateInfo = require('../models/updateInfoModel')
const fetchWeatherData = require('../core/fetchData')
const checkIfDataCurrent = require('../core/checkDataCurrency')
const jsonToText = require('../core/jsonToText')

const MAX_WEATHER_FORECAST = 7
let isDataUpdated = false

router.get('/', (req, res) => {
    console.log(req.headers['content-type']);
    res.send("Simple Weather Service")
})


/**
 * Get result from DB
 * require zipcode and day out
 */
router.get('/getWeatherResult/:zipcode/:days',  async (req, res) => {
 
    const { days, zipcode } = req.params;
    const isJson = req.headers['content-type'] == "application/json" ? true : false;  

    if(!days || days < 1) 
        days = 1;

    if(zipcode.search(/[0-9]{5}/) === -1) {
        try {
            res.status(200).json({
                success: false,
                message: 'Invalid Zip Code format.  Only 5 digit valid Zip Code Allowed'
            })
        }catch(err) {
            res.status(500).json({
                success: false,    
                message: err.message
            });    
        }
        return;
    }

    try {
        let data = await Weather.find({zipcode: zipcode});
        let weatherData = data[0].data;
        let city = `${data[0].region.city}, ${data[0].region.state}`;

        if(!isJson) {            
            if(!days || days >= MAX_WEATHER_FORECAST)  
                res.status(200).send(jsonToText({
                    zipcode, 
                    city,
                    weatherData: weatherData.slice(0, days*2)}));
            else 
                res.status(200).send(jsonToText({
                    zipcode, 
                    city,
                    weatherData}));
        }
        else {
            if(!days || days >= MAX_WEATHER_FORECAST)  
                res.status(200).json({
                    zipcode, 
                    city,
                    weatherData});
            else                    
                res.status(200).json({
                    zipcode, 
                    city,
                    weatherData: weatherData.slice(0, days*2)});
        }

    }catch(err) {       
        res.status(500).json({
            success: false,    
            message: err.message
        });       
    }
})

/**
 * Check If Weather Data is Current
 * If not, it will sync from api.weather.gov
 * 
 */
router.patch('/checkIfDataCurrent', async(req, res) => {
    isDataUpdated = false;
        
    try {
        let lastUpdateDB = await UpdateInfo.findOne();
        if(!lastUpdateDB) {

            lastUpdateDB  = new UpdateInfo({    
                lastUpdate: Date.now(),
                lastUpdateGMTString: new Date().toJSON().substring(0,10)
            })            
            const saveInfo = await lastUpdateDB.save()
            res.status(200).json(saveInfo)   
        }else {
            console.log(lastUpdateDB.lastUpdateGMTString)
            if(lastUpdateDB.lastUpdateGMTString === new Date().toJSON().substring(0,10)){
                res.status(200).json({ 
                    success: true,             
                    message: 'No need to update, Data already UpToDate'
                });
                isDataUpdated = true;
            }else {
                lastUpdateDB.lastUpdate = Date.now();
                lastUpdateDB.lastUpdateGMTString = new Date().toJSON().substring(0,10);
                await lastUpdateDB.save();
                res.status(200).json({ 
                    success: true,
                    message: 'Data needs to be Updated'
                });
            }
        }

    }catch(err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message : err.message
        })
    }

})


/**
 * 
 * It will forcely sync data from api.weather.gov
 * 
 */
router.post('/SyncWeatherData', async(req, res) => { 
       await fetchWeatherData('MA'); 
       res.status(200).send("Weather Data Updated")
})

/*
router.post('/SyncWeatherData', checkIfDataCurrent, async(req, res) => { 
       await fetchWeatherData('MA'); 
       res.status(200).send("Weather Data Updated")
})
*/

/**
 * Sync up weather data per zip code
 * Please see weather.test.rest for detail
 */
router.post('/weatherSync', async(req, res) => {
    const {zipcode, region, data} = req.body;
    try {
        const latestDataInDB = new Weather({    
            zipcode,
            region,
            data
        });
        const saveInfo = await latestDataInDB.save()
        res.status(201).json({
            success: true,
            message: saveInfo
        })
    }catch(err) {
        console.log({
            success: false,
            message: err.message
        })
    } 
})


/**
 * Delete all Weather Data from DB
 * Injunction use with /weatherSync and /checkIfDataCurrent
 * Use this call before /weatherSync or /checkIfDataCurrent
 * 
 */
router.delete('/deleteWeatherData', async (req, res) => {
    try {
        const weatherData = await Weather.deleteMany();
        const updateData = await UpdateInfo.deleteMany();
        res.status(201).json({
            success: true,
            message: {
                weatherData,
                updateData
            }
        });
        //res.send(result);
    }catch(err){
        res.status(500);
        res.send({
            success: false,
            message: "Delete Operation Error " + err.message
        });
    }
})

module.exports = router
