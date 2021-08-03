const express = require('express');
const router = express.Router();
const db = require('../connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config()

exports.SignUp = (req, res) => {
    console.log(req.body);
    const { email, password, firstname, lastname, company, description, type, phoneNumber } = req.body;

    db.query('SELECT email from users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
            res.send('Error: ', error);
        }
        if (result.length > 0) {
            return res.status(200).json({ msg: 'This user is already exist' });
        }

        let hashedPassword = await bcrypt.hash(password, 2);
        console.log('HashPassword:', hashedPassword);

        db.query('INSERT INTO users SET ?', {
            email: email, password: hashedPassword, firstname: firstname, lastname: lastname,
            org_name: company, description: description, type: type, phone_num: phoneNumber, createdDate: new Date()
        }, (error, result) => {
            if (error) {
                console.log(error);
                res.send('Something went wrong');
            }
            else {
                console.log(result);
                res.status(200).json({ msg: 'User Registered' });
            }
        });
    });
};

exports.SignIn = (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please provide email or password' });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);
            const encryptedPass = await bcrypt.compare(password, results[0].password);
            if (!results || !encryptedPass) {
                res.status(401).json({ msg: 'Invalid Email or Password' });
            }
            else {
                var expiry = new Date();
                expiry.setDate(expiry.getDate() + 7);

                const email = results[0].email;
                const token = jwt.sign({ email: email }, process.env.JWT_KEY, {
                    expiresIn: parseInt(expiry.getTime() / 1000)
                });

                res.status(200).json({ msg: 'Login Successfuly', token: token });
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: error });
    }
};

exports.Sent_Post = (req, res) => {
    const { user_id, content, status, profile } = req.body;
    if (status == 'sent') {
        var sql = 'INSERT INTO postcontent SET ?';
        var values = {
            user_id: user_id,
            content: content,
            status: status,
            profile: profile,
            created_date: new Date(),
            sent_date: new Date()
        };

        db.query(sql, [values], (error, result) => {
            if (error) {
                console.log(error);
                res.send('Something went wrong.');
            }
            else {
                console.log(result);
                res.send(result);
            }
        });
    }
};

exports.Draft_Post = (req, res) => {
    const { user_id, content, status, profile } = req.body;
    if (status == 'draft') {
        var sql = 'INSERT INTO postcontent SET ?';
        var values = {
            user_id: user_id,
            content: content,
            status: status,
            profile: profile,
            created_date: new Date()
            // updated_date: new Date()
        };

        db.query(sql, [values], (error, result) => {
            if (error) {
                console.log(error);
                res.send('Something went wrong.');
            }
            else {
                console.log(result);
                res.send(result);
            }
        });
    }
};

exports.Get_Sent_Content = (req, res) => {
    try {
        db.query("SELECT * FROM postcontent WHERE status = 'sent' ORDER BY sent_date DESC", (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).json({ err: error });
            }
            else {
                console.log(result);
                res.status(200).json({ data: result });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ err: error });
    }
};

exports.Get_Draft_Content = (req, res) => {
    try {
        db.query("SELECT * FROM postcontent WHERE status = 'draft' ORDER BY id DESC", (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).json({ err: error });
            }
            else {
                console.log(result);
                res.status(200).json({ data: result });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ err: error });
    }
};
