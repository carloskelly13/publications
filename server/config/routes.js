
/**
 * Publications JS API
 * Routes Configuration
 * Michael Kelly and Carlos Paelinck
 */

var cors = require('cors'), 
  IndexController = require('../controllers/index'),
  UserController = require('../controllers/user'),
  UserModel = require('../models/user'),
  DocumentController = require('../controllers/document'),
  DocumentModel = require('../models/document')

var auth = function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.send(401);
  } else {
    next();
  }
};

module.exports = function (app, passport) {
  // Index routes
  app.options('*', cors());

  app.get('/', IndexController.index);

  // Application routes
  app.get('/logout', UserController.logout);
  app.post('/login', passport.authenticate('local'), UserController.login);

  app.param('userId', function(req, res, next, id) {
    UserModel.findById(id, function(err, user) {
      if (err || !user) {
        res.send(404);
      } else {
        req.user = user;
        next();
      }
    });
  });

  app.get('/users/current', UserController.show);
  app.put('/users/:userId', auth, UserController.update);
  app.post('/users', UserController.create);

  // Document model routes
  app.param('docId', function(req, res, next, id) {
    if (req.user) {
      DocumentModel.findById(id, function(err, doc) {
        if (err || !doc) {
          res.send(404);

        } else if (doc._user.toString() === req.user._id.toString()) {
          req.doc = doc;
          next();

        } else {
          res.send(403);
        }
      });

    } else {
      res.send(401);
    }
  });

  app.get('/documents', auth, DocumentController.index);
  app.get('/documents/:docId', auth, DocumentController.show);
  app.post('/documents', auth, DocumentController.create);
  app.put('/documents/:docId', auth, DocumentController.update);
  app.delete('/documents/:docId', auth, DocumentController.remove);
  app.get('/documents/:docId/pdf', auth, DocumentController.pdf);

  // 404 Error
  app.use(function(req, res) { res.send(404); });
};
