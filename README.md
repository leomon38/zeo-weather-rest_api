This is Weather REST API


### If you want to use locally, you have to install MongoDB
Change the DATABASE_URL in .env file
### RUN
`npm i`
`npm start`


### Otherwise, you may install Docker and run 
`docker-compose up`

### For Unit Testing Please install Visual Studio Code 
### And install "Rest Client " extension
 You can test API by using 
 "user.test.rest"  for adding user with user's favorite region weather
 "weather.test.rest"  for weather data service management
 
 ### Another way is use JMeter.  File is included 
 "Weather API Test.jmx"


 ### Caution!!!!
 "http://api.weather.gov" Lmimited fetch calls.
 Therefore, this sample App only fetch 500 location in Massachusetts 
 There are about 700 zipcodes in Massachusetts



==================== Detail: Weather Service Management ============================
### Simple Test The REST API
GET http://localhost:3000/weatherServices/
Content-Type: text/plain


### Check latest update date
PATCH http://localhost:3000/weatherServices/checkIfDataCurrent
Content-Type: application/json
{}

###  Delete weather Data from DB 
DELETE http://localhost:3000/weatherServices/deleteWeatherData


###  Sync about 500 Entries from api.weather.gov
###  You could be temporarily banned for about an hour if request more
POST http://localhost:3000/weatherServices/SyncWeatherData

###  Post your weather data in, please see weatherData.json for sample json data
POST http://localhost:3000/weatherServices/weatherSync
Content-Type: application/json

< ./weatherData.json

### Get upcoming {days} (1-7) Data according the zipcode, Response is JSON
### http://localhost:3000/weatherServices/getWeatherResult/{zipcode}/{days}
GET http://localhost:3000/weatherServices/getWeatherResult/02739/7
Content-Type: application/json

### Get upcoming {days} (1-7) Data according the zipcode, Response is Plain Text
### http://localhost:3000/weatherServices/getWeatherResult/{zipcode}/{days}
GET http://localhost:3000/weatherServices/getWeatherResult/02739/3
Content-Type: text/plain



============================== User Service Management ==========================
### Simple REST call to the userService
GET http://localhost:3000/userService

### Save your favor city into your user account
POST http://localhost:3000/userService/saveRegion
Content-Type: application/json
{
    "username": "TestUser2",
    "zipcode": "02739"
}

### Get weather from user's favor location, response JSON
### http://localhost:3000/userService/getUserPrefWeather/{username}/{days}
GET http://localhost:3000/userService/getUserPrefWeather/TestUser2/1
Content-Type: application/json

### Get weather from user's favor location, response Plain Text
### http://localhost:3000/userService/getUserPrefWeather/{username}/{days}
http://localhost:3000/userService/getUserPrefWeather/TestUser2/1
GET http://localhost:3000/userService/getUserPrefWeather/TestUser2/1
Content-Type: text/plain
