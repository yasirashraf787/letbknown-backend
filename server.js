const app = require('./app');
// const https = require('https');
const http = require('http');
// const fs = require('fs');
// const path = require('path');

// const options = {
//     key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
// };

const port = process.env.PORT || 3000;

// https.globalAgent.options.secureProtocol = 'SSLv3_method';
// const SSLserver = https.createServer(options, app);

const server = http.createServer(app);

server.listen(port, () => {
    console.log('Secure Server running on port:', port);
});

// SSLserver.listen(port, () => {
//     console.log('Secure Server running on port:', port);
// })