const express = require('express')
//const Weather = require('../models/weatherDataModel')
const UpdateInfo = require('../models/updateInfoModel')

module.exports = async function checkIfDataCurrent(req, res, next) {
        
    try {
        let lastUpdateDB = await UpdateInfo.findOne();
        if(!lastUpdateDB) {

            lastUpdateDB  = new UpdateInfo({    
                lastUpdate: Date.now(),
                lastUpdateGMTString: new Date().toJSON().substring(0,10)
            })            
            const saveInfo = await lastUpdateDB.save()
            //res.status(200).json(saveInfo)   
            next(); 
        }else {
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
               
               /* res.status(200).json({ 
                    success: true,
                    message: 'Data needs to be Updated'
                });
                */
                next(); 
            }
        }

    }catch(err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message : err.message
        })
    }

}