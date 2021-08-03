const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const twitterRoute = require('./routs/twitter');
const linkedinRoute = require('./routs/linkedin');
const letbknownRoute = require('./routs/letbknown');

// const mysql = require('./connection');


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(session({
    secret: 'my_linkedin_secret_5612705',
    resave: false,
    saveUninitialized: false
}));

app.use('/twitter', twitterRoute);
app.use('/linkedin', linkedinRoute);
app.use('/letbknown', letbknownRoute);

module.exports = app;
