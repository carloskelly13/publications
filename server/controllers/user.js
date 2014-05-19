
/**
 * Publications JS API
 * User Controller
 * Michael Kelly and Carlos Paelinck
 */

var bcrypt = require('bcrypt')
  , _ = require('lodash')
  , UserModel = require('../models/user')

exports.show = function(req, res) {
  res.json(req.user);
};

exports.update = function(req, res) {
  var userJson = req.body
    , user = req.user;
    
  bcrypt.compare(userJson.currentPassword, user.password, function(err, isValid) {
    if (isValid) {
      var updateUser = _.extend(user, userJson);
      delete updateUser.currentPassword;
      
      updateUser.save(function(err, user) {
        return res.json(user || err);
      });
      
    } else {
      res.send(403);
    }
  });
};

exports.login = function(req, res) {
  res.send(req.user);
};

exports.logout = function(req, res) {
  var user = req.user;
  
  UserModel.findById(user._id, function(err, user) {
    if (!err && user) {
      if (user.temporary) {
        user.remove();
      }
    }
  });

  req.logout();
  res.json({});
};

exports.create = function(req, res) {
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
  if (req.user) {
    res.json(req.user);
    
  } else {
    res.send(401);
  }
};