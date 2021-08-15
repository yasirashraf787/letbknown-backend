const express = require('express');
const router = express.Router();
const db = require('../connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbController = require('../controller/dbController');

require('dotenv').config()

router.get('/', (req,res)=>{
    res.json({"message:" : "Welcome To LetBKnown!!!"});
});

router.post('/Signup', dbController.SignUp);
router.post('/Login', dbController.SignIn);
router.post('/Sent', dbController.Sent_Post);
router.post('/Draft', dbController.Draft_Post);
router.post('/Scheduled', dbController.Scheduled_Post);

router.get('/GetSentContent', dbController.Get_Sent_Content);
router.get('/GetDraftContent', dbController.Get_Draft_Content);
router.get('/GetDraftContent/:id', dbController.Get_Draft_Content_By_ID);
router.post('/UpdateDraftContent/:id', dbController.Update_Draft_Content_By_ID);
router.post('/UpdateStatus/:id', dbController.UPDATE_STATUS);
router.get('/GetScheduledContent', dbController.Get_Scheduled_Content);
router.get('/GetScheduledContent/:id', dbController.Get_Scheduled_Content_By_ID);
router.post('/UpdateScheduledContent/:id', dbController.Update_Scheduled_Content_By_ID);

dbController.Job.StartScheduler();

module.exports = router;