
/**
 * Publications
 * NodeJS Application Server
 * 2014 Michael Kelly and Carlos Paelinck
 */

var express = require('express'),
  cors = require('cors'),
  logger = require('morgan'),
  favicon = require('serve-favicon'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  path = require('path')

require('./server/config/passport')(passport)

var app = express()

// all environments
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:8100',
  credentials: true
}))
app.use(session({
  secret: '36bf03edbbc39b3ab6f89463e47639ca25fe8836e43bae065124fd7d26d9a804',
  name: 'app.publications',
  cookie: {
    maxAge: 31536000000
  }
}))

app.set('port', process.env.PORT || 4000)
app.set('views', __dirname + '/client')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, '/client')))
app.use(favicon(__dirname + '/client/img/favicon.ico'))

var env = process.env.NODE_ENV || 'development'
if ('development' === env.toString()) {
  app.use(logger('dev'))
}

require('./server/config/routes')(app, passport)

mongoose.connect('mongodb://localhost/pub-ng')

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
})
