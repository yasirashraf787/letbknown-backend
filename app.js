const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const twitterRoute = require('./routs/twitter');
const linkedinRoute = require('./routs/linkedin');
const facebookRoute = require('./routs/facebook');
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

// app.use('/', (req, res) => {
//     res.send('Hello from SSL server');
// })

app.use('/twitter', twitterRoute);
app.use('/linkedin', linkedinRoute);
app.use('/letbknown', letbknownRoute);
app.use('/facebook', facebookRoute);

const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer(app);



server.listen(port, () => {
    console.log('Server running on port:', port);
})

//module.exports = app;


