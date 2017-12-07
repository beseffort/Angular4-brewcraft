var logger = require('morgan');
var cors = require('cors');
var http = require('http');
var express = require('express');
var errorhandler = require('errorhandler');
var dotenv = require('dotenv');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./global/config');
var session = require('express-session');
var path = require('path');
var fs = require('graceful-fs');
var config = require('./global/config');


// Firebase Initiailize
var firebase = require("firebase");
firebase.initializeApp(config.FIREBASE_CONFIG);

// Requrie apis
var authenticate = require('./api/authenticate');
var accountHandler = require('./api/accounts');
var guildHanlder = require('./api/guild');
var messageHandler = require('./api/message');
var postHandler = require('./api/post.js');
var recipeHandler = require('./api/recipe.js');
var wordpressHandler = require('./api/wordpress.js');
var brewdayHandler = require('./api/brewday.js');
var clientHanlder = require('./router.js');

var app = express();

//View Engine
app.set('views', path.join(__dirname, '../client/dist'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Embed File server
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../client/dist')));

dotenv.load();

// Parsers
// old version of line
// app.use(bodyParser.urlencoded());
// new version of line

app.use(session({
  secret: 'keyboard cat',
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors());
app.use(cookieParser());

app.use(function (err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(err);
  }
});

app.get('/register', (req, res, next) => {
  console.log('signup');
  res.redirect('/');
  return;
});


if (process.env.NODE_ENV === 'development') {
  app.use(express.logger('dev'));
  app.use(errorhandler());
}
 
app.use('/auth', authenticate);
app.use('/accounts', accountHandler);
app.use('/guilds', guildHanlder);
app.use('/messages', messageHandler);
app.use('/posts', postHandler);
app.use('/recipes', recipeHandler);
app.use('/wordpress', wordpressHandler);
app.use('/brewday', brewdayHandler);
app.use('/*', clientHanlder);
 
var port = process.env.PORT || 8080; 

http.createServer(app).listen(port, function (err) {
  console.log('listening on port:' + port);
});

