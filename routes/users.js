var express = require('express');
var router = express.Router();

router.get('/', async function(req, res) {
    if(req.user) {
        res.render('account', {title: 'Account', logged_in: true});
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
