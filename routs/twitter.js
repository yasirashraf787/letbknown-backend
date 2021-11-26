const express = require('express');
const router = express.Router();
const twitter = require('twit');
const oauth = require('oauth');
require('dotenv').config();

// const client = new twitter({
//     consumer_key: 'XJ3v59z4tm5HZEUM6AmG6w7Y8',
//     consumer_secret: 'y3aeVcimtbzLO4kqoNpD7GAZewrdQ6RX6OGk16oCMlIyrTZL3z',
//     access_token: '2939667442-xbjo0bbKimmi0Wqa9ER6T4UccnDny2MuRfVL6Qh', //'1375393061228908545-O1KHdanhQF4bWbLFkBINexZwDEdSk8',
//     access_token_secret: 'ZMpIFUseW48zrw62dlfvJyzFj24H8ifQFBmdz2fSYQiJM' //'4QaKrCp2HRUlrkdWvOrEwnAaZuobLn0ofUkaklnzEnsaE'
// });
// test commit
const consumer = new oauth.OAuth('https://api.twitter.com/oauth/request_token', 'https://api.twitter.com/oauth/access_token',
    process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET, "1.0A", null, "HMAC-SHA1");

router.post('/post', (request, response) => {
    const client = new twitter({
        consumer_key: process.env.CONSUMER_KEY, //'XJ3v59z4tm5HZEUM6AmG6w7Y8',
        consumer_secret: process.env.CONSUMER_SECRET, //'y3aeVcimtbzLO4kqoNpD7GAZewrdQ6RX6OGk16oCMlIyrTZL3z',
        access_token: request.query.oauth_token,
        access_token_secret: request.query.oauth_token_secret
    });

    var tweet = { status: request.body.message };

    client.post('statuses/update', tweet).then(timeline => {
        console.log(timeline);
        response.status(200).json(timeline);
    }).catch(err => {
        response.status(500).json({
            error: err
        });
    })
});

router.get('/getTweets', (request, response) => {
    console.log('Get tweet call', request.query);
    const client = new twitter({
        consumer_key: process.env.CONSUMER_KEY, //'XJ3v59z4tm5HZEUM6AmG6w7Y8',
        consumer_secret: process.env.CONSUMER_SECRET, //'y3aeVcimtbzLO4kqoNpD7GAZewrdQ6RX6OGk16oCMlIyrTZL3z',
        access_token: request.query.access_token,
        access_token_secret: request.query.access_token_secret
    });

    client.get('tweets/1371393042708582400').then(timeline => {
        console.log(timeline);
    }).catch(err => {
        console.log(err);
    });
});

router.get('/getUserInfo', (request, response) => {
    // response.send(request.query);
    const client = new twitter({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: request.query.oauth_token,
        access_token_secret: request.query.oauth_token_secret
    });
    // console.log(request.query);
    // var url = '2/users/' + request.query;
    // console.log(url);
    // response.send("chk");
    // client.get('2//users/' + request.query.userId).then(result => {
    //     console.log(result);
    //     response.send(result);
    // }).catch(err => {
    //     console.log(err);
    // });
});

router.get('/startAuth', (request, response) => {

    consumer.getOAuthRequestToken((err, token, token_secret, results) => {
        // console.log(process.env.CONSUMER_SECRET)
        if (err) {
            console.log(err);
            response.status(500).json(err);
        }
        else {
            console.log("oauthRequestToken " + token);
            console.log("oauthRequestTokenSecret " + token_secret);
            response.status(200).send({
                redirectUrl: "https://twitter.com/oauth/authorize?oauth_token=" + token,
                oauthRequestToken: token,
                oauthRequestTokenSecret: token_secret
            })
        }
    });
});

router.post('/accessToken', (request, response) => {
    console.log(request.query);
    consumer.getOAuthAccessToken(request.query.oauth_token, request.query.oauth_token_secret, request.query.oauth_verifier,
        (err, oAuthAccessToken, oAuthAccessTokenSecret, results) => {
            if (err) {
                response.status(500).send('Error found : ' + err);
            }
            else {
                console.log('Access Token: ' + oAuthAccessToken);
                console.log('Access Token Secret: ' + oAuthAccessTokenSecret);

                response.status(200).json({ access_token: oAuthAccessToken, access_token_secret: oAuthAccessTokenSecret, result: results });
            }
        });
});

module.exports = router;