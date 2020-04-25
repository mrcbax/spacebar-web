var express = require('express');
var router = express.Router();

router.get('/', async function(req, res) {
    if(req.user) {
        res.render('account', {
            title: 'Account',
            logged_in: true,
            username: req.user.username,
            email: req.user.email,
            api_public: req.user.api_public,
            api_secret: req.user.api_secret
                  });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
