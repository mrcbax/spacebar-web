var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var session = require("express-session");
var bodyParser = require("body-parser");
var hcaptcha = require('express-hcaptcha');
var cors = require('cors');
const bcrypt = require('bcrypt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth.js');
var dashRouter = require('./routes/dashboard.js');

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const SECRET = config.hcaptcha_key;

var db = require('./util/database.js');

var app = express();

var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// enable cors
app.options('*', cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'spacebar',
    resave: false,
    saveUninitialized: false,
		cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use('/', indexRouter);
app.use('/account', usersRouter);
app.use('/', authRouter);
app.use('/dashboard', dashRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

passport.use(new LocalStrategy((username, password, cb) => {
		db.query('SELECT id, username, password, email, api_public, api_secret, password, is_admin FROM users WHERE username=$1', [username], (err, result) => {
			  if(err) {
				    return cb(err);
			  }

			  if(result.rows.length > 0) {
				    const first = result.rows[0];
				    bcrypt.compare(password, first.password, function(err, res) {
					      if(res) {
						        return cb(null, { id: first.id, username: first.username, is_admin: first.is_admin });
					      } else {
						        return cb(null, false);
					      }
				    });
			  } else {
				    return cb(null, false);
			  }
		});
}));

passport.serializeUser((user, done) => {
		done(null, user.id);
});

passport.deserializeUser((id, cb) => {
		db.query('SELECT id, username, email, api_public, api_secret, password, is_admin FROM users WHERE id = $1', [parseInt(id, 10)], (err, results) => {
			  if(err) {
				    return cb(err);
			  }

			  cb(null, results.rows[0]);
		});
});

app.post('/verify', hcaptcha.middleware.validate(SECRET), (req, res) => {
    res.json({message: 'verified!', hcaptcha: req.hcaptcha});
});

module.exports = app;
