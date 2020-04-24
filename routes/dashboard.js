var express = require('express');
var router = express.Router();

router.get('/', async function(req, res){
    if (req.user) {
        var spacebar = [
            {
                date: '2020',
                name: 'testbar1',
                desc: 'testbardesc1',
                loc: 'https://example.com',
                spacebar: ''
            },
            {
                date: '2020',
                name: 'testbar2',
                desc: 'testbardesc2',
                loc: 'https://example.com',
                spacebar: ''
            }
        ];
        res.render('dashboard', {title: 'Dashboard', spacebars: spacebar, logged_in: true});
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
