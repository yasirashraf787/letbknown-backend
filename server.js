const app = require('./app');
const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

app.get('/', (req,res)=>{
    res.json({"message:" : "Welcome To LetBKnown!!!"});
});


server.listen(port, () => {
    console.log('Server running on port:', port);
})