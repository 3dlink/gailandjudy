var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multiparty = require('multiparty')

mongoose.connect('mongodb://localhost/GyJ');
require('./models/Users');
require('./models/Brands');
require('./models/Items');
require('./models/Likes');
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

app.use(function(req,res,next){
  if (req.url === '/getImage') {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/uploadImg" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
  }
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
