var express = require('express');
var router = express.Router();

router.get('/', async function(req, res){
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
    res.render('dashboard', {spacebars: spacebar, logged_in: true});
});

module.exports = router;
