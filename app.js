var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var session = require("express-session");
var bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth.js');
var dashRouter = require('./routes/dashboard.js');

var app = express();

var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
app.use(bodyParser());
app.use(session({ secret: 'spacebar' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
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

var user_cache = {};

passport.serializeUser(function(user, next) {
    let id = user.username;
    user_cache[id] = user;
    next(null, id);
});

passport.deserializeUser(function(id, next) {
    next(null, user_cache[id]);
});

passport.use(new LocalStrategy(function(username, password, done) {
    // database.login(username, password, done);
    if (username === 'admin' && password === 'admin') {
        loggedIn = true;
        console.log('in');
        done(null, {'username': username, 'password': password});
    } else {
        done(null, false);
    }
}));

module.exports = app;
