
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

    // Document model routes
    app.get('/document/:id?', auth, DocumentController.show);
    app.post('/document', auth, DocumentController.create);
    app.put('/document/:id?', auth, DocumentController.update);
    app.delete('/document/:id?', auth, DocumentController.delete);
    app.get('/document/:id?/pdf', auth, DocumentController.pdf);
};