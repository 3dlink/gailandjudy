var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multiparty = require('multiparty')
var fs = require('fs');
var url = require('url');

// GyJDev Clean
// MONGO URI
// mongodb://<user>:<pass>@jello.modulusmongo.net:27017/sIrid4oq
// MONGO CONSOLE
// mongo jello.modulusmongo.net:27017/sIrid4oq -u <user> -p <pass>
// mongoose.connect('mongodb://3dlink:3dlink21@jello.modulusmongo.net:27017/sIrid4oq')

// mongo jello.modulusmongo.net:27017/tume2Nig -u GJ -p 12345678

// localhost
// mongoose.connect('mongodb://localhost/GyJ');

mongoose.connect('mongodb://cahl:london.123@ds059516.mlab.com:59516/heroku_v3sp241p')

// produccion
// mongoose.connect('mongodb://GJ:12345678@jello.modulusmongo.net:27017/tume2Nig');


require('./models/Users');
require('./models/Brands');
require('./models/Items');
require('./models/Likes');
require('./models/Ignores');
require('./models/Follows');
require('./models/Matchs');
require('./models/Notifications');
require('./models/Closedeals');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', *);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
};

app.configure(function() {
    app.use(allowCrossDomain);
});

app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next){
  // if (req.url === '/gtI') {
  //   var img = fs.readFileSync('uploads/5sD3zKo6ZBcSXeT7TtFgcCnl.jpg');
  //   res.writeHead(200, {'Content-Type': 'text/html' });
  //   res.end(img, 'binary');
  // }
  // if (req.url === '/getImage') {
  //   res.writeHead(200, {'content-type': 'text/html'});
  //   res.end(
  //     '<form action="/uploadImg" enctype="multipart/form-data" method="post">'+
  //     '<input type="text" name="title"><br>'+
  //     '<input type="file" name="upload" multiple="multiple"><br>'+
  //     '<input type="submit" value="Upload">'+
  //     '</form>'
  //   );
  // }
  // else if (req.url === '/upload') {
  //   var form = new multiparty.Form({autoFiles:true, uploadDir:'uploads/'});
  //
  //   form.parse(req, function(err, fields, files) {
  //     if (err) {
  //       res.writeHead(400, {'content-type': 'text/plain'});
  //       res.end("invalid request: " + err.message);
  //       return;
  //     }
  //     return;
  //     res.writeHead(200, {'content-type': 'text/plain'});
  //     // res.write('received fields:\n\n '+util.inspect(fields));
  //     // res.write('\n\n');
  //     // res.end('received files:\n\n '+util.inspect(files));
  //   });
  // }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
