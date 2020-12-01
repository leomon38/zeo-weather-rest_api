require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const DATABASE_URL = process.env.LOCAL_DATABASE_URL;
const PORT_NUMBER = process.env.REST_HOST_PORT;

const weatherDataRouter = require('./routers/weatherDataRouter');
const userRouter = require('./routers/userRouter');


mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', error => console.log(error))
db.once('open', () => console.log("Connected"))

app.use(express.json())
app.use('/weatherServices', weatherDataRouter);

// For favorite region per user
app.use('/userService', userRouter);


app.listen(PORT_NUMBER, () => {});



