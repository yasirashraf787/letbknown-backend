const express = require('express');
const router = express.Router();
const req = require('request');
require('dotenv').config();

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const authorizationURL = 'https://www.linkedin.com/oauth/v2/authorization';
const accessTokenURL = 'https://www.linkedin.com/oauth/v2/accessToken';
const redirectURI = 'http://localhost:3000/linkedin/callback';

router.get('/auth', (request, response) => {
    
    const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
    const url = `${authorizationURL}?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectURI)}&response_type=code&scope=${scope}`

    response.status(200).json({
        redirectURL: url
    });
});

router.get('/callback_error', (request, response) => {
    response.send('Some thing went wrong.');
});

router.get('/callback', async (request, response) => {
    if(!request.query.code){
        response.redirect('/linkedin/callback_error');
        return;
    }
    else
    {      
        response.redirect('https://localhost:4200/letthemknow?code=' + request.query.code);  
        // try{
        //     const data = await getAccessToken(request);
        //     response.send(data);
        // } catch(err) {
        //     response.json(err);
        // }
    }
});

function getAccessToken(request) {
    const code = request.query.code;
    const body = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectURI,
        client_id: clientID,
        client_secret: clientSecret
    };

    return new Promise((resolve, reject) => {
        req.post({url: accessTokenURL, form: body}, (err, response, body) => {
            if(err){
                reject(err);
            }
            resolve(JSON.parse(body));
        });
    });
}

// router.get('/user', (request, response) => {
//     response.send(response.body);
// });

module.exports = router;