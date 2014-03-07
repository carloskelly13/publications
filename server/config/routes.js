
/**
 * Publications JS API
 * Routes Configuration
 * Michael Kelly and Carlos Paelinck
 */

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
  app.post('/login', passport.authenticate('local'), function(req, res) { res.send(req.user); });
  app.get('/logout', function(req, res){ req.logout(); res.json({}); });

  // User model routes
  app.get('/users/current', UserController.current);
  app.get('/users/:id?', auth, UserController.show);
  app.post('/users', UserController.create);

  // Document model routes
  app.get('/documents', auth, DocumentController.index);
  app.get('/documents/:id', auth, DocumentController.show);
  app.post('/documents', auth, DocumentController.create);
  app.put('/documents/:id', auth, DocumentController.update);
  app.del('/documents/:id', auth, DocumentController.remove);
  app.get('/documents/:id/pdf', auth, DocumentController.pdf);

  // 404 Error
  app.use(function(req, res) { res.render('404'); });
};