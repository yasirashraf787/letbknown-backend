const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql123',
    database: 'letbknown',
    timezone: 'UTC+0'

    // host: 'localhost',
    // user: 'root',
    // password: 'root',
    // database: 'letbknown',
    // timezone: 'UTC+0'

    //    host: 'aaketpum4ii4nl.cbenxjbir7bt.us-east-2.rds.amazonaws.com',
    //     user:'admin',
    //     password: 'letbknown',
    //     database: 'letbknown'
});

db.connect((err) => {
    if (!err) {
        console.log('MySQL Connected');
    }
    else {
        console.log('Connection Failed', JSON.stringify(err, undefined, 2));
    }
});

module.exports = db;