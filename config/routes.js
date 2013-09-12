
/**
 * Publications JS API
 * Routes Configuration
 * Michael Kelly and Carlos Paelinck
 */

var express = require('express'),
    mongoose = require('mongoose');

var IndexController = require('../controllers/index'),
    UserController = require('../controllers/user'),
    DocumentController = require('../controllers/document');

var auth = function (req, res, next) {
    if (!req.isAuthenticated()) res.send(401);
    else next();
};

module.exports = function (app, passport) {
    // Index routes
    app.get('/', IndexController.index);

    // Application routes
    app.post('/app/signin', passport.authenticate('local'), function(req, res) { res.send(req.user); });
    app.get('/app/signout', function(req, res){ req.logout(); res.json({}); });

    // User model routes
    app.get('/user/:id?', auth, UserController.show);
    app.post('/user', UserController.create);

    app.use('/document/*', auth);

    // Document model routes
    app.get('/document/:id?', DocumentController.show);
    app.post('/document', DocumentController.create);
    app.put('/document/:id?', DocumentController.update);
    app.delete('/document/:id?', DocumentController.delete);
    app.get('/document/:id?/pdf', DocumentController.pdf);

    // 404 Error
    app.use(function(req, res, next) { res.render('404'); });
};