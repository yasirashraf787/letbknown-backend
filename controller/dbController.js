const express = require('express');
const router = express.Router();
const db = require('../connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const req = require('request');

// Job Scheduler
const JobScheduler = require('cron').CronJob;

require('dotenv').config()

exports.SignUp = (req, res) => {
    console.log(req.body);
    const { email, password, firstname, lastname, company, description, type, phoneNumber } = req.body;

    db.query('SELECT * from users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
            res.send('Error: ', error);
        }
        if (result.length > 0) {
            return res.status(200).json({ msg: 'This user is already exist', result: result });
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
                res.status(200).json({ msg: 'User Registered', result: result });
            }
        });
    });
};

exports.SignIn = (req, res) => {
    // res.status(200).json({result: 'Hello world'});
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please provide email or password' });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results.length);
            if (results.length > 0) {
                const encryptedPass = await bcrypt.compare(password, results[0].password);
                if (!results || !encryptedPass) {
                    res.status(200).json({ msg: 'Invalid Email or Password', loggedIn: false });
                }
                else {
                    var expiry = new Date();
                    expiry.setDate(expiry.getDate() + 7);

                    const email = results[0].email;
                    const token = jwt.sign({ email: email }, process.env.JWT_KEY, {
                        expiresIn: parseInt(expiry.getTime() / 1000)
                    });

                    res.status(200).json({ msg: 'Login Successfuly', token: token, loggedIn: true, results });
                }
            }
            else {
                res.status(200).json({ msg: 'User not exist', loggedIn: 'user_not_exist', results });
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: error });
    }
};

exports.POST_SM_Profile_Data = (req, res) => {

    const {
        user_id, profile_name, profile_user_id, page_id, 
        page_account_name, user_access_token, page_access_token,
        oauth_access_token, oauth_access_token_secret
    } = req.body;
    //SELECT COUNT(*) AS namesCount FROM names WHERE age = ?
    db.query('SELECT COUNT(*) AS userProfiles FROM smprofiles WHERE user_id = ?', [user_id], async (error, result) => {
        console.log('SM profle Result: ', result[0].userProfiles);
        if (result[0].userProfiles >= 3) {
            console.log('This UserId has reached the maximum number of profiles');
            res.status(200).json({ msg: 'This UserId has reached the maximum number of profiles' });
        }
        else if (result[0].userProfiles >= 0) {
            p_name = profile_name.toString();
            console.log(p_name);
            // console.log('SELECT * FROM smprofiles WHERE user_id = ' + user_id + ' AND profile_name = ' + profile_name);
            if (profile_name == 'facebook') {
                db.query('SELECT * FROM smprofiles WHERE user_id = ' + user_id + ' AND profile_name = "facebook"', (error, result) => {
                    if (error) {
                        console.log(error);
                        res.send('Error: ', error);
                    }
                    else {
                        console.log(result);
                        if (result.length == 0) {
                            db.query('INSERT INTO smprofiles SET ?', {
                                user_id: user_id, profile_name: profile_name, user_access_token: user_access_token,
                                profile_user_id: profile_user_id, page_id: page_id, page_account_name: page_account_name, page_access_token: page_access_token
                            }, (error, result) => {
                                if (error) {
                                    console.log(error);
                                    res.send('Something went wrong : ' + error);
                                }
                                else {
                                    console.log(result);
                                    res.status(200).json({ msg: 'User SM Profile Registered', result });
                                }
                            });
                        }
                        else if (result.length > 0) {
                            console.log('Result Length: ' + result.length);
                            res.status(200).json({ msg: 'This user is already regestered with facebook profile', result });
                        }
                    }
                });
            }
            else if (profile_name == 'twitter') {
                db.query('SELECT * FROM smprofiles WHERE user_id = ' + user_id + ' AND profile_name = "twitter"', (error, result) => {
                    if (error) {
                        console.log(error);
                        res.send('Error: ', error);
                    }
                    else {
                        console.log(result);
                        if (result.length == 0) {
                            db.query('INSERT INTO smprofiles SET ?', {
                                user_id: user_id, 
                                profile_name: profile_name,
                                profile_user_id: profile_user_id,
                                page_account_name: page_account_name,
                                oauth_access_token: oauth_access_token,
                                oauth_access_token_secret: oauth_access_token_secret
                            }, (error, result) => {
                                if (error) {
                                    console.log(error);
                                    res.send('Something went wrong : ' + error);
                                }
                                else {
                                    console.log(result);
                                    res.status(200).json({ msg: 'User SM Profile Registered', result });
                                }
                            });
                        }
                        else if (result.length > 0) {
                            console.log('Result Length: ' + result.length);
                            res.status(200).json({ msg: 'This user is already regestered with twitter profile', result });
                        }
                    }
                });
            }
            else if (profile_name == 'linkedin') {
                db.query('SELECT * FROM smprofiles WHERE user_id = ' + user_id + ' AND profile_name = "linkedin"', (error, result) => {
                    if (error) {
                        console.log(error);
                        res.send('Error: ', error);
                    }
                    else {
                        console.log(result);
                        if (result.length == 0) {
                            db.query('INSERT INTO smprofiles SET ?', {
                                user_id: user_id, 
                                profile_name: profile_name,
                                profile_user_id: profile_user_id,
                                page_account_name: page_account_name,
                                user_access_token: user_access_token
                            }, (error, result) => {
                                if (error) {
                                    console.log(error);
                                    res.send('Something went wrong : ' + error);
                                }
                                else {
                                    console.log(result);
                                    res.status(200).json({ msg: 'User SM Profile Registered', result });
                                }
                            });
                        }
                        else if (result.length > 0) {
                            console.log('Result Length: ' + result.length);
                            res.status(200).json({ msg: 'This user is already regestered with twitter profile', result });
                        }
                    }
                });
            }
        }
    });
};

exports.GET_SM_Profile_Data = (req, res) => {

    console.log('userId in get smprofile data: ', req.params.id);
    db.query('SELECT * FROM smprofiles WHERE user_id = ?', [req.params.id], async (error, result) => {
        console.log('User Result', result);
        if (error) {
            console.log(error);
            res.send('Something went wrong : ' + error);
        }
        else {
            console.log(result);
            res.status(200).json({ result });
        }
    });
};

exports.UPDATE_SM_Profile_Data_UserAndPageAccessToken = (req, res) => {
    const user_access_token = req.body.user_access_token;
    const page_access_token = req.body.page_access_token;

    const oauth_access_token = req.body.oauth_access_token;
    const oauth_access_token_secret = req.body.oauth_access_token_secret;

    const profile_name = req.body.profile_name;

    console.log('Profile Name: ', profile_name);
    var sql = null;
    var values = null;

    if (profile_name == 'facebook') {
        sql = "UPDATE smprofiles SET ? WHERE user_id = " + req.params.id + " AND profile_name = 'facebook'";
        values = {
            user_access_token: user_access_token,
            page_access_token: page_access_token,
        }
    }
    else if (profile_name == 'twitter') {
        sql = "UPDATE smprofiles SET ? WHERE user_id = " + req.params.id + " AND profile_name = 'twitter'";
        values = {
            oauth_access_token: oauth_access_token,
            oauth_access_token_secret: oauth_access_token_secret,
        }
    }

    db.query(sql, [values], (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).json({ err: error });
        }
        else {
            console.log(result);
            res.status(200).json({ data: result });
        }
    });
};

exports.Sent_Post = (req, res) => {
    const { user_id, content, status, profile } = req.body;
    // res.status(200).json({ msg: content });
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
            created_date: new Date(),
            updated_date: new Date()
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

exports.Scheduled_Post = (req, res) => {
    const { user_id, content, status, profile, scheduled_date } = req.body;
    if (status == 'scheduled') {
        var sql = 'INSERT INTO postcontent SET ?';
        var values = {
            user_id: user_id,
            content: content,
            status: status,
            profile: profile,
            created_date: new Date(),
            updated_date: new Date(),
            scheduled_date: new Date(scheduled_date)
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

exports.Get_Sent_Content_By_ID = (req, res) => {
    try {
        db.query("SELECT * FROM postcontent WHERE user_id = " + req.params.id + " AND status = 'sent' ORDER BY sent_date DESC", (error, result) => {
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

exports.Get_Twitter_Sent_Content = (req, res) => {
    try {
        db.query("SELECT * FROM postcontent WHERE status = 'sent' AND profile = 'twitter' ORDER BY sent_date DESC", (error, result) => {
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

exports.Get_Draft_Content_By_ID = (req, res) => {
    try {
        db.query("SELECT * FROM postcontent WHERE user_id = " + req.params.id + " AND status = 'draft' ORDER BY id DESC", (error, result) => {
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

exports.Update_Draft_Content_By_ID = (req, res) => {
    try {
        const { content, profile, status } = req.body;

        var sql = 'UPDATE postcontent SET ? WHERE id = ' + req.params.id;//content = ' + content + ', profile = ' + profile + ', updated_date = ' + new Date() + ' WHERE id = ' + req.params.id;//?, profile =?, updated_date =? WHERE id = ?';
        var values = {
            content: content,
            profile: profile,
            status: status,
            updated_date: new Date(),
        }

        db.query(sql, [values], (error, result) => {
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

exports.Delete_Draft_Content_By_ID = (req, res) => {
    try {
        var sql = "DELETE FROM postcontent WHERE id = " + req.params.id + " AND status = 'draft'";
        db.query(sql, (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).json({ err: error });
            }
            else {
                res.status(200).json({ data: result, msg: 'deleted' });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ err: error });
    }
};

exports.UPDATE_STATUS = (req, res) => {
    try {
        const { status, content, profile } = req.body;

        var sql = "UPDATE postcontent SET ? WHERE id = " + req.params.id + " AND (status = 'draft' OR status = 'scheduled')";
        var values = {
            status: status,
            content: content,
            profile: profile,
            sent_date: new Date(),
            updated_date: null,
            scheduled_date: null
        }

        db.query(sql, [values], (error, result) => {
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

exports.Get_Scheduled_Content = (req, res) => {
    try {
        db.query("SELECT * FROM postcontent WHERE status = 'scheduled' ORDER BY id DESC", (error, result) => {
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

exports.Get_Scheduled_Content_By_ID = (req, res) => {
    try {
        db.query("SELECT * FROM postcontent WHERE user_id = " + req.params.id + " AND status = 'scheduled' ORDER BY id DESC", (error, result) => {
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

exports.Update_Scheduled_Content_By_ID = (req, res) => {
    try {
        const { content, profile, status, scheduled_date } = req.body;

        var sql = 'UPDATE postcontent SET ? WHERE id = ' + req.params.id;//content = ' + content + ', profile = ' + profile + ', updated_date = ' + new Date() + ' WHERE id = ' + req.params.id;//?, profile =?, updated_date =? WHERE id = ?';
        var values = {
            content: content,
            profile: profile,
            status: status,
            updated_date: new Date(),
            sent_date: null,
            scheduled_date: scheduled_date
        }

        db.query(sql, [values], (error, result) => {
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

exports.Delete_Scheduled_Content_By_ID = (req, res) => {
    try {
        var sql = "DELETE FROM postcontent WHERE id = " + req.params.id + " AND status = 'scheduled'";
        db.query(sql, (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).json({ err: error });
            }
            else {
                res.status(200).json({ data: result, msg: 'deleted' });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ err: error });
    }
};

// -------------------- JOB SCHEDULER -----------------------------
exports.Job = {
    StartScheduler: function () {
        var job = new JobScheduler('*/1 * * * *', function () {
            console.log('####### >>>>>>> You will see this message every minute <<<<<<<< #########');
            let date_ob = new Date();

            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            let currentDate = year + "-" + month + "-" + date;// + " " + hours + ":" + minutes + ":" + seconds;

            if (hours < 10) {
                hours = '0' + hours;
            }

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            let currentTime = hours + ":" + minutes;
            let cut_15min = minutes;

            if (minutes >= 15) {
                cut_15min = minutes - 15;
            }
            if (cut_15min < 10) {
                cut_15min = '0' + cut_15min;
            }

            let beforeTime_15min = hours + ":" + cut_15min;

            console.log('Current Date Time: ', currentDate, currentTime);
            console.log('Before Time : ', beforeTime_15min);

            var c_date = "2021-08-05";
            var time_before_15_min = "19:07";
            var c_time = "19:08";

            try {
                db.query('SELECT * FROM postcontent WHERE scheduled_date BETWEEN ' + `"${currentDate} ${beforeTime_15min}"` + ' AND ' + `"${currentDate} ${currentTime}"`, (error, result) => {
                    if (error) {
                        console.log('Error', error);
                    }
                    else {

                        for (let i = 0; i < result.length; i++) {
                            console.log('Result', result);
                            console.log('Result Length', result.length);
                            console.log('Content', result[i].content);
                            // console.log('ID', result[0].id)
                            if (result.length > 0) {
                                var sql = "UPDATE postcontent SET ? WHERE id = " + result[i].id + " AND status = 'scheduled'";
                                var values = {
                                    status: 'sent',
                                    sent_date: new Date(),
                                    updated_date: null,
                                    scheduled_date: null
                                }

                                console.log(sql);

                                db.query(sql, [values], (error, dbResult) => {
                                    if (error) {
                                        console.log(error);
                                        // res.status(500).json({ err: error });
                                    }
                                    else {
                                        console.log(dbResult);

                                        if (result[i].profile == 'facebook') {
                                            req.post({
                                                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                                                url: "https://graph.facebook.com/111230367702601/feed?message=" + result[i].content + "&access_token=EAAKGddpdmc0BAApAemqzndZB8jaGEN6aXU386V4FLr330NAESOeNTTLteV2ern3BcphIn3KwbUAecaJg9du2RwfiZBfyWuZCbABRV7C1SZBNspLw2ZAvLPPNhFCLXmzEsc2PhCUpAOgLGMBI00hzUWf9Au7z5WLH8KPy8Ou3BvRI0yoSooiFb",
                                            }, function (error, res, body) {
                                                if (error) {
                                                    response.status(500).json({ error: error });
                                                }
                                                else {
                                                    console.log(body);
                                                    console.log('Content Posted', result[i].content);
                                                    // response.status(200).json({ msg: 'Content Posted' });
                                                }
                                            });
                                        }

                                        // res.status(200).json({ data: result });
                                    }
                                });
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.log(error);
            }

        }, null, true);

        job.start();
    }
}