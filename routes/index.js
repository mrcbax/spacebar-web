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

module.exports = router;
