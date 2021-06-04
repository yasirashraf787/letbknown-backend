const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql123',
    database: 'letbknown'
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