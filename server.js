const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const twitterRout = require('./routs/twitter');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/twitter', twitterRout);

app.listen(3000, () => {
    console.log('Server running');
})