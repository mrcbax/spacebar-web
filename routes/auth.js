var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/login',
         passport.authenticate('local', { successRedirect: '/',
                                          failureRedirect: '/login',
                                          failureFlash: true })
        );

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Log In' });
});

router.get('/logout', function(req, res){
    loggedIn = false;
    req.logout();
    res.redirect('/');
});

module.exports = router;
