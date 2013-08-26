
/**
 * Publications JS API
 * Application Server
 * Michael Kelly and Carlos Paelinck
 */

var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    http = require('http'),
    path = require('path'),
    _ = require('lodash');

var UserModel = require('./models/user'),
    DocumentModel = require('./models/document'),
    ShapeModel = require('./models/shape');

require('./config/passport')(passport);

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./config/routes')(app, passport);

mongoose.connect('mongodb://localhost/pub-js');

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
