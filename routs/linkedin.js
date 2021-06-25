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
    response.redirect('https://localhost:4200/letthemknow');
});

router.get('/callback', async (request, response) => {
    if (!request.query.code) {
        response.redirect('/linkedin/callback_error');
        return;
    }
    else {
        try {
            const data = await getAccessToken(request);
            // console.log(data);
            if (data.access_token) {
                // console.log('Line 36: ', data);
                request.session.token = data.access_token;
                request.session.authorized = true;
                console.log(request.session);
                console.log('sessionToken: ', request.session);
            }
            // response.redirect('/linkedin/user');
            response.redirect('https://localhost:4200/letthemknow?authorized=' + request.session.authorized + '&token=' + data.access_token);
            // response.status(200).send('Get access token');
        } catch (err) {
            response.json(err);
        }
    }
});

router.get('/user', async (request, response) => {

    // response.status(200).json({Authorized: request.query.isAuthorized, token: request.query.token});
    const isAuthorized = request.query.isAuthorized;
    if (!isAuthorized) {
        response.status(200).json({ Authorized: false });
    } else {
        try {
            const id = await getLinkedinId(request);
            response.status(200).json({ userId: id });
        } catch (err) {
            response.send(err);
        }
    }
});

router.post('/publish', async (request, response) => {
    const { title, text, url, thumb, id } = request.body;
    const content = {
        title: title,
        text: text,
        shareUrl: url,
        shareThumbnailUrl: thumb
    };

    try {
        const res = await publishContent(request, id, content);
        response.json({ success: 'Post published successfully. ', result: res });
    } catch (err) {
        response.json({ error: 'Unable to publish your content. ', errorMsg: err });
    }
});

router.get('/logout', (request, response) => {
})

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
        req.post({ url: accessTokenURL, form: body }, (err, response, body) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(body));
        });
    });
}

function getLinkedinId(request) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.linkedin.com/v2/me';
        const headers = {
            'Authorization': 'Bearer ' + request.query.token,
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0'
        };

        req.get({ url: url, headers: headers }, (err, response, body) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(body).id);
        });
    });
}

function publishContent(request, linkedinId, content) {
    const url = 'https://api.linkedin.com/v2/shares';
    const { title, text, shareUrl, shareThumbnailUrl } = content;
    const body = {
        owner: 'urn:li:person:' + linkedinId,
        subject: title,
        text: {
            text: text
        },
        content: {
            contentEntities: [{
                entityLocation: shareUrl,
                thumbnails: [{
                    resolvedUrl: shareThumbnailUrl
                }]
            }],
            title: title
        },
        distribution: {
            linkedInDistributionTarget: {}
        }
    };

    const headers = {
        'Authorization': 'Bearer ' + request.query.access_token,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0',
        'x-li-format': 'json'
    };

    return new Promise((resolve, reject) => {
        req.post({ url: url, json: body, headers: headers }, (err, response, body) => {
            if (err) {
                reject(err);
            }
            resolve(body);
        });
    });
}

module.exports = router;