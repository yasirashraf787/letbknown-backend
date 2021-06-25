const express = require('express');
const router = express.Router();
const db = require('../connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbController = require('../controller/dbController');

require('dotenv').config()

router.post('/Signup', dbController.SignUp);
router.post('/Login', dbController.SignIn);

router.post('/Sent', (req, res) => {
    const { user_id, postDetail } = req.body;
    // res.status(200).json({ data: req.body });
    // db.query('INSERT INTO ')
});

module.exports = router;