var smtpConfig = {
    host: 'pikos.com.ve',
    port: 26,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
        user: 'contacto@pikos.com.ve',
        pass: 'pikosweb123456'
    }
}

var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var multiparty = require('multiparty')
var util = require('util');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var Brands = mongoose.model('Brands');
var Items = mongoose.model('Items');
var Likes = mongoose.model('Likes');
var Ignores = mongoose.model('Ignores');
var Follows = mongoose.model('Follows');
var Matchs = mongoose.model('Matchs');
var Closedeals = mongoose.model('Closedeals');
var Notifications = mongoose.model('Notifications');

var fs = require('fs');
var url = require('url');
// var formidable = require('formidable');
var path = require('path');
var types = {
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// var shippo = require('shippo')('81d9f09b6933f1074796fa9adf05cc965ac488e1');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
