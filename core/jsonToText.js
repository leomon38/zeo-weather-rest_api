module.exports = function jsonToText(json) {
    const { zipcode, city, weatherData } = json;

    let resultString = `Weather forecast for ${city} ${zipcode}\n`;
    resultString += `Date\t\t  Start Date\t\t isDayTime\t\t temperature\t\t windInfo\t\t detailForecast\n`;

    weatherData.forEach(data => {
        const { date, startTime, temperature, windInfo, detailedForecast } = data;
        resultString += `${date}\t ${startTime}\t ${temperature}\t ${windInfo}\t ${detailedForecast}\n`;
    })
    return resultString + '\n\n';
}