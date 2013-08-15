
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

if (_.contains(process.argv, 'db:seed')) {

    var user = new UserModel({
        name: 'carlos13@icloud.com',
        password: '123'
    });

    user.save(function(err) {
        var documentModel = new DocumentModel({
            _user: user._id,
            name: 'Sample Document',
            width: 432, height: 288
        });

        documentModel.save(function(err) {
            new ShapeModel({
                _document: documentModel._id,
                type: 1, width: 72, height: 72,
                x: 108, y: 108, z: 0,
                color: '#3498db',
                strokeColor: '#2980b9', strokeWidth: 2
            }).save();

            new ShapeModel({
                _document: documentModel._id,
                type: 2, width: 72, height: 72,
                x: 216, y: 216, z: 0,
                color: '#2ecc71',
                strokeColor: '#27ae60', strokeWidth: 4
            }).save();
        });
    });
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
