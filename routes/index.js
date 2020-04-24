var express = require('express');
var router = express.Router();
var db = require('../util/database.js');
const bcrypt = require('bcrypt');
var crypto = require('crypto');

const saltRounds = 10;

/* GET home page. */
router.get('/', async function(req, res, next) {
    var logged_in = false ;
    if (req.user) logged_in = true;
    res.render('index', {
        title: 'Spacebars',
        welcome: 'Spacebars',
        blurb: 'A copy-paste resilient plagiarism detection system.',
        logged_in: logged_in
    });
});

router.get('/forgot', async function(req, res, next) {
    res.render('forgot', {
        title: 'Spacebars',
        logged_in: false
    });
});

router.get('/forgot_api', async function(req, res, next) {
    res.render('forgot_api', {
        title: 'Spacebars',
        logged_in: false
    });
});

router.get('/signup', async function(req, res, next) {
    var nomatch = false;
    if(req.query.nomatch) {
        nomatch = true;
    }
    if(!req.user) {
        res.render('create_user', {
            title: 'Spacebars',
            logged_in: false,
            nomatch: nomatch
        });
    } else {
        res.redirect('login');
    }
});

router.post('/signup', function(req, res, next) {
    console.log(req.body);
    if (req.body.password[0] == req.body.password[1]) {
        var shasum = crypto.createHash('sha1');
        var sha256sum = crypto.createHash('sha256');
        bcrypt.hash(req.body.password[0], saltRounds, async function(err, hash) {
            console.log(err);
            var salt = makeid(16);
            shasum.update(salt + req.body.email + salt);
            var public = shasum.digest('hex');
            sha256sum.update(salt + req.body.password[0] + salt);
            var private = sha512sum.digest('hex');
            const query = "INSERT INTO users (username, email, password, api_salt, api_public, api_secret, is_admin) VALUES ($1,$2,$3,$4,$5,$6,false)";
            const resp = await db.query(query, [req.body.username, req.body.email, hash, salt, public, private]);
            res.redirect('/login');
        });
    } else {
        res.redirect('/signup?nomatch=true');
    }
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = router;
