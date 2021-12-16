module.exports = {
    REDIRECT_URI_LOCAL : 'http://localhost:3000/linkedin/callback',
    REDIRECT_URI_AWS : 'https://letbknownbackend-env.eba-jpy2yec2.us-east-2.elasticbeanstalk.com/linkedin/callback',
    CALLBACK_ERROR_REDIRECT_URL_LOCAL : 'https://localhost:4200/Socialmediaprofile',
    CALLBACK_ERROR_REDIRECT_URL_AWS : 'https://api.letbeknown.com/Socialmediaprofile', //'https://d3rtuj6gjvv7z0.cloudfront.net/Socialmediaprofile',
    CALLBACK_SUCCESS_REDIRECT_URL_LOCAL : 'https://localhost:4200/Socialmediaprofile?authorized=',
    CALLBACK_SUCCESS_REDIRECT_URL_AWS : 'https://api.letbeknown.com/Socialmediaprofile?authorized=' //'https://d3rtuj6gjvv7z0.cloudfront.net/Socialmediaprofile?authorized=',
}