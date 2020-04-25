var express = require('express');
var router = express.Router();
var db = require('../util/database.js');
const bcrypt = require('bcrypt');
var crypto = require('crypto');

router.get('/', async function(req, res) {
    var api_error, api_incorrect = false;
    if (req.query.api_error) {
        api_error = true;
    }
    if (req.query.api_incorrect) {
        api_incorrect = true;
    }
    if(req.user) {
        res.render('account', {
            title: 'Account',
            logged_in: true,
            user_id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            api_public: req.user.api_public,
            api_secret: req.user.api_secret,
            api_error: api_error,
            api_incorrect: api_incorrect
                  });
    } else {
        res.redirect('/login');
    }
});

async function regen_api(uid, email, password) {
    var shasum = crypto.createHash('sha1');
    var sha256sum = crypto.createHash('sha256');
    var salt = makeid(16);
    shasum.update(salt + email + salt);
    var public = shasum.digest('hex');
    sha256sum.update(salt + password + salt);
    var private = sha256sum.digest('hex');
    try {
        const query = "UPDATE users SET api_public = $1, api_secret = $2, api_salt = $3 WHERE id = $4";
        const resp = await db.query(query, [public, private, salt, uid]);
        return true;
    } catch (e) {
        return false;
    }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.post('/regen_api', async function(req, res) {
    try {
				bcrypt.compare(req.body.api_password, req.user.password, async function(err, result) {
            if(err) {
                console.log(err);
                res.redirect('/account?api_error=true');
            } else {
					      if(result) {
                    if (await regen_api(req.user.id, req.user.email, req.body.api_password)) {
                        res.redirect('/account');
                    } else {
                        res.redirect('/account?api_error=true');
                    }
                } else {
                    res.redirect('/account?api_incorrect=true');
                }
            }
        });
    } catch (e) {
        console.log(e);
        res.redirect('/account?api_error=true');
    }
});

module.exports = router;
