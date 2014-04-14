
/**
 * Publications JS API
 * User Controller
 * Michael Kelly and Carlos Paelinck
 */

var _ = require('lodash')
  , bcrypt = require('bcrypt')
  , UserModel = require('../models/user')

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

exports.update = function(req, res) {
  var userId = req.route.params.id
    , userJson = req.body
    
  bcrypt.compare(userJson.oldPassword, userJson.password, function(err, isValid) {
    if (isValid) {
      delete userJson._id;
      
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(userJson.newPassword, salt, function(err, hash) {
          userJson.password = hash;
          UserModel.findByIdAndUpdate(userId,
            userJson,
            { upsert: true },
            function(err, updatedUser) {
            return res.json(updatedUser || {});
          });
        });
      });
      
    } else {
      res.json({ invalidPassword: true });
    }
  });
};

exports.login = function(req, res) {
  res.send(req.user);
};

exports.logout = function(req, res) {
  var user = req.user;
  
  UserModel.findById(user._id, function(err, userModel) {
    if (userModel.temporary) {
      userModel.remove();
    }
  });

  req.logout();
  res.json({});
};

exports.createDefault = function(req, res) {
  
  bcrypt.genSalt(5, function(err, salt) {
    bcrypt.hash(new Date().toLocaleTimeString(), salt, function(err, nameHash) {
      var userModel = new UserModel({
        name: nameHash,
        password: 'password',
        temporary: true
      });
      
      userModel.save(function(err, user) {
        res.json(user || null);
      });
    });
  });
};

exports.current = function(req, res) {
  var user = req.user;
  res.json(_.isObject(user) ? user : null);
};