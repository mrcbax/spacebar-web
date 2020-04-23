var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    res.render('index', {
        title: 'Spacebars',
        welcome: 'Spacebars',
        blurb: 'A copy-paste resilient plagiarism detection system.',
        logged_in: true
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
    res.render('create_user', {
        title: 'Spacebars',
        logged_in: false
    });
});

module.exports = router;
