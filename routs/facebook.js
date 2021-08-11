const express = require('express');
const router = express.Router();
const req = require('request');
require('dotenv').config();

router.post('/PublishScheduledContent/:pageId', (request, response) => {
    const pageID = request.params.pageId;
    const { message, access_token } = request.body;

    req.post({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: "https://graph.facebook.com/" + pageID + "/feed?message=" + message + "&access_token=" + access_token,
    }, function (error, res, body) {
        if (error) {
            response.status(500).json({ error: error });
        }
        else {
            console.log(body);
            response.status(200).json({ msg: 'Content Posted' });
        }
    });

});

module.exports = router;