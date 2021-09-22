const express = require('express');
const router = express.Router();
const db = require('../connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbController = require('../controller/dbController');
const multer = require('multer');

require('dotenv').config()

router.get('/', (req, res) => {
    res.json({ "message:": "Welcome To LetBKnown!!!" });
});

router.post('/Signup', dbController.SignUp);
router.post('/Login', dbController.SignIn);

router.post('/PostSMProfilesData', dbController.POST_SM_Profile_Data);
router.get('/GetSMProfilesData/:id', dbController.GET_SM_Profile_Data);
router.post('/UpdateSMProfilesData/:id', dbController.UPDATE_SM_Profile_Data_UserAndPageAccessToken);

router.post('/Sent', dbController.Sent_Post);
router.post('/Draft', dbController.Draft_Post);
router.post('/Scheduled', dbController.Scheduled_Post);

router.get('/GetSentContent', dbController.Get_Sent_Content);
router.get('/GetTwitterSentContent', dbController.Get_Twitter_Sent_Content);

router.get('/GetDraftContent', dbController.Get_Draft_Content);
router.get('/GetDraftContent/:id', dbController.Get_Draft_Content_By_ID);
router.post('/UpdateDraftContent/:id', dbController.Update_Draft_Content_By_ID);
router.post('/DeleteDraftContent/:id', dbController.Delete_Draft_Content_By_ID);
router.post('/UpdateStatus/:id', dbController.UPDATE_STATUS);
router.get('/GetScheduledContent', dbController.Get_Scheduled_Content);
router.get('/GetScheduledContent/:id', dbController.Get_Scheduled_Content_By_ID);
router.post('/UpdateScheduledContent/:id', dbController.Update_Scheduled_Content_By_ID);
router.post('/DeleteScheduledContent/:id', dbController.Delete_Scheduled_Content_By_ID);

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
        callback(null, `IMG_${file.originalname}`);
    }
});

var upload = multer({ storage: storage });

// router.post('/UploadFile', (req, res) => {
//     console.log('Body:', req.file);
//     res.status(200).json({ result: req.file });
// });

router.post('/UploadFile', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
        res.send('Please upload a file');
    }
    else {
        console.log(file.filename);
    }

    res.send(file);
});

dbController.Job.StartScheduler();

module.exports = router;