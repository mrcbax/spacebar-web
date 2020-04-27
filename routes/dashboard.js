var express = require('express');
var router = express.Router();
var sanitizer = require('sanitizer');

var db = require('../util/database.js');

const ONE = '\u200b';
const ZERO = '\ufeff';

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function bin2spacebar(bin) {
    var ret = "";
    for (var i = 0; i < bin.length; i++) {
        if(bin[i] == '1') {
            ret += (ONE);
        } else {
            ret += (ZERO);
        }
    }
    return ret;
}

router.post('/create', async function (req, res) {
    if(req.user) {
        if (req.body.name) {
            try {
                var dec = Math.trunc(Math.random() * Number.MAX_SAFE_INTEGER);
                const query = "INSERT INTO spacebars (owner_id, created, spacebar, name, description, url) VALUES ($1, now(), $2, $3, $4, $5)";
                const resp = await db.query(query, [req.user.id, dec, sanitizer.sanitize(req.body.name), sanitizer.sanitize(req.body.description), sanitizer.escape(req.body.url)]);
                res.redirect('/dashboard?create_success=true');
            } catch (e) {
                console.log(e);
                res.redirect('/dashboard?create_error=true');
            }
        } else {
            res.redirect('/dashboard?create_missing=true');
        }
    } else {
        res.redirect('/login');
    }
});

router.post('/delete', async function (req, res) {
    if(req.user) {
        try {
            const query = "DELETE FROM spacebars WHERE id = $1 AND owner_id = $2";
            const resp = await db.query(query, [req.body.id, req.user.id]);
            res.redirect('/dashboard?delete_success=true');
        } catch (e) {
            console.log(e);
            res.redirect('/dashboard?delete_error=true');
        }
    } else {
        res.redirect('/login');
    }
});

router.get('/', async function (req, res) {
    var error, delete_success, delete_error, create_success, create_missing, create_error = false;
    if (req.query.delete_success) {
        delete_success = true;
    }
    if (req.query.delete_error) {
        delete_error = true;
    }
    if (req.query.create_success) {
        create_success = true;
    }
    if (req.query.create_missing) {
        create_missing = true;
    }
    if (req.query.create_error) {
        create_error = true;
    }
    if (!req.query.error && req.user) {
        var spacebars = [];
        try {
            const query = "SELECT *, to_char(created, 'yyyy-mm-dd HH24:MI:SS') as date_formatted FROM spacebars WHERE owner_id = $1";
            const resp = await db.query(query, [req.user.id]);

            for (var i = 0; i < resp.rows.length; i++) {
                spacebars.push({
                    id: resp.rows[i].id,
                    date: resp.rows[i].date_formatted,
                    name: resp.rows[i].name,
                    desc: resp.rows[i].description,
                    loc: resp.rows[i].url,
                    spacebar: bin2spacebar(dec2bin(resp.rows[i].spacebar))
                });
            }
        } catch (e) {
            console.log(e);
            res.redirect('/dashboard?error=true');
        }
    } else {
        error = true;
    }
    if(req.user) {
        res.render('dashboard', {
            title: 'Dashboard',
            spacebars: spacebars,
            logged_in: true,
            error: error,
            delete_success: delete_success,
            delete_error: delete_error,
            create_success: create_success,
            create_missing: create_missing,
            create_error: create_error
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/individual', async function (req, res) {
    if(req.user) {
        if(req.query.id) {
            res.render('details', {title: 'Details', spacebar: spacebar, logged_in: true});
        } else {
            res.redirect('/dashboard');
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
