const express = require('express');
const router = express.Router();
const db = require('../connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbController = require('../controller/dbController');

require('dotenv').config()

router.post('/Signup', dbController.SignUp);
router.post('/Login', dbController.SignIn);
router.post('/Sent', dbController.Sent_Post);
router.post('/Draft', dbController.Draft_Post);

router.get('/GetSentContent', dbController.Get_Sent_Content);
router.get('/GetDraftContent', dbController.Get_Draft_Content);


module.exports = router;