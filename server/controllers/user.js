
/**
 * Publications JS API
 * User Controller
 * Michael Kelly and Carlos Paelinck
 */

var _ = require('lodash');

var UserModel = require('../models/user'),
  DocumentModel = require('../models/document');

exports.show = function(req, res) {
  var id = req.route.params.id;

  UserModel.findById(id, function(err, user) {
    res.json(user || null);
  });
};

exports.create = function(req, res) {
  var userData = req.body,
    userModel = new UserModel(userData);

  userModel.save(function(err, user) {
    res.json(user || null);
  });
};

exports.current = function(req, res) {
  var user = req.user;
  res.json(_.isObject(user) ? user : null);
};