
/**
 * Publications JS API
 * User Controller
 * Michael Kelly and Carlos Paelinck
 */

var bcrypt = require('bcrypt')
  , UserModel = require('../models/user')

exports.show = function(req, res) {
  res.json(req.user);
};

exports.update = function(req, res) {
  var userJson = req.body
    , user = req.user;
    
  if (userJson._id.toString() === user._id.toString()) {
    bcrypt.compare(userJson.currentPassword, userJson.password, function(err, isValid) {
      if (isValid) {
        delete userJson._id;
        
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(userJson.newPassword, salt, function(err, hash) {
            userJson.password = hash;
            
            UserModel.findByIdAndUpdate(user._id, userJson, { upsert: true },
              function(err, updatedUser) {
                return res.json(updatedUser || err);
              }
            );
          });
        });
        
      } else {
        res.send(403);
      }
    });
  } else {
    res.send(403);
  }
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