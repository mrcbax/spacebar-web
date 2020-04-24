var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/login',
         passport.authenticate('local', { successRedirect: '/dashboard',
                                          failureRedirect: '/login'})
        );

router.get('/login', async function(req, res) {
    res.render('login', { title: 'Log In', logged_in: false});
});

router.get('/logout', async function(req, res){
    loggedIn = false;
    req.logout();
    res.redirect('/');
});

module.exports = router;
