const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const twitterRout = require('./routs/twitter');
const linkedinRout = require('./routs/linkedin');
const session = require('express-session');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use('/twitter', twitterRout);
app.use('/linkedin', linkedinRout);

app.listen(3000, () => {
    console.log('Server running');
})