var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/login',
         passport.authenticate('local', { successRedirect: '/dashboard',
                                          failureRedirect: '/login?failed=true'})
        );

router.get('/login', async function(req, res) {
    var failed = false;
    if(req.query.failed) {
        failed = true;
    }
    res.render('login', { title: 'Log In', logged_in: false, failed: failed});
});

router.get('/logout', async function(req, res){
    loggedIn = false;
    req.logout();
    res.redirect('/');
});

module.exports = router;
