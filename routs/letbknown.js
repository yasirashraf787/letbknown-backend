const express = require('express');
const router = express.Router();
const db = require('../connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbController = require('../controller/dbController');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

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
router.get('/GetSentContent/:id', dbController.Get_Sent_Content_By_ID);

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
const s3 = new aws.S3({
    accessKeyId: 'AKIA4MMMFII2OZ7PAVPA',
    secretAccessKey: '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'
});

var uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'thrumpit-videos',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, `IMG_${file.originalname}`)
        }
    })
});

// router.post('/UploadFile', (req, res) => {
//     console.log('Body:', req.file);
//     res.status(200).json({ result: req.file });
// });

router.post('/UploadFile', uploadS3.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
        res.send('Please upload a file');
    }
    else {
        console.log('File: ', file);
        console.log('File Location:', file.location);
    }

    res.send(file);
});

router.post('/DeleteFile', (req, res) => {
    s3.deleteObject({
        Bucket: 'thrumpit-videos',
        Key: 'IMG_State_Highway_62_NZ.png'
    }, (error, data) => {
        console.log('Error:', error);
        console.log('Data:', data);

        if (error) {
            res.status(500).send(error);
        }
        else {
            res.status(200).json({ msg: 'File has been deleted successfully', data });
        }
    });
});

dbController.Job.StartScheduler();

module.exports = router;