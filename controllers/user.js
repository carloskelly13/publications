
/**
 * Publications JS API
 * User Controller
 * Michael Kelly and Carlos Paelinck
 */

var mongoose = require('mongoose'),
    _ = require('lodash');

var UserModel = require('../models/user');

exports.show = function(req, res) {
    var id = req.route.params.id;

    UserModel.findById(id, function(err, user) {
        if (_.isObject(user))
            res.json(user);
        else
            res.json(null);
    });
};

exports.create = function(req, res) {
    var userData = req.body,
        userModel = new UserModel(userData);

    userModel.save(function(err, user) {
        if (_.isObject(user)) res.json(user);
        else res.json(err);
    });
};