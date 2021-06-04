const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const twitterRoute = require('./routs/twitter');
const linkedinRoute = require('./routs/linkedin');
const letbknownRoute = require('./routs/letbknown');

// const mysql = require('./connection');


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/twitter', twitterRoute);
app.use('/linkedin', linkedinRoute);
app.use('/letbknown', letbknownRoute);

module.exports = app;
