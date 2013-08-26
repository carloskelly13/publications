
/**
 * Publications JS API
 * Passport Configuration
 * Michael Kelly and Carlos Paelinck
 */

var _ = require('lodash');

var LocalStrategy = require('passport-local').Strategy,
    UserModel = require('../models/user');

module.exports = function(passport) {
    passport.use(new LocalStrategy(function(username, password, done) {
        UserModel.findOne({ name: username }, function(err, user) {
            if (_.isNull(user)) return done(err);
            user.validatePassword(password, function(err, isValid) {
                if (err) return done(err);
                if (isValid) return done(null, user);
                else return done(null, false, { message: 'Incorrect Password' });
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
};