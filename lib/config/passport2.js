var passport = require('passport');
var user2 = require('../models/user2');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    user2.User.find(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    user2.User.findOne({
        where: {
            email: email
        }
    }, function (err, user) {
        if (err)
            return done(err);

        if (!user) {
            return done(null, false, {
                message: 'This email is not registered.'
            });
        }
        if (!user.authenticate(password)) {
            return done(null, false, {
                message: 'This password is not correct.'
            });
        }
        return done(null, user);
    });
}));

module.exports = passport;
