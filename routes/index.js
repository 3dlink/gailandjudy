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

router.post('/uploadFilePic', function(req, res, next){
  // console.log('que fuerte');
  // var form = new multiparty.Form({autoFiles:true, uploadDir:'public/images/'});
  // form.parse(req, function(err, fields, files) {
  //   res.json(files);
  //   // res.json(files['file'][0]['path']);
  // })
  var nameI = "";

  console.log("QUe pasen el gif");
  // Parse the request. Any body-parser can be used for this.
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    console.log(file);
    if(typeof file !== 'undefined'){
      console.log(1)
      // The key was set as 'image' on the formData object in the client.
      var file = files.image;
      console.log(11)

      var extension = types[file.type.toLowerCase()];
      nameI = Date.now() + '.' + extension;
      // Target path is uploads directory relative to this file.

      var target = path.resolve(__dirname, '../public/images', nameI);
      console.log(111)

      // Copy the file from the tmp folder to the uploads location
      fs.createReadStream(file.path).pipe(fs.createWriteStream(target));
      console.log(111)

      res.json(nameI);
    }
    else{
      res.json(true);
    }
  });

})

router.post('/up', function (req, res) {
  console.log("QUe pasen el gif");

  // Parse the request. Any body-parser can be used for this.
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {

    // The key was set as 'image' on the formData object in the client.
    var file = files.image;
    //
    // if (!file) {
    //   // return res.status(400).send('No image received');
    // }

    var extension = types[file.type.toLowerCase()];
    //
    // // Make sure the extension is valid.
    // if (!extension) {
    //   // return res.status(400).send('Invalid file type');
    // }

    // Target path is uploads directory relative to this file.
    var target = path.resolve(__dirname, '../public/images', Date.now() + '.' + extension);

    // Copy the file from the tmp folder to the uploads location
    fs.createReadStream(file.path)
      .pipe(fs.createWriteStream(target));

    res.json(true);
  });
});

router.get('/viewNotification/:id', function(req, res, next){
  Notifications.findOne({_id:req.params.id} ,function(err, noti){
    noti['view'] = 1;
    noti.save(function(err, not){
      res.json(true);
    })
  })

});

router.get('/shippo', function(req, res, next){

  // shippo._api.dev = true;
  //
  // shippo.address.create({
  //    'object_purpose' : 'PURCHASE',
  //    'name' : 'Mr Hergueta',
  //    'company' : '3Dlink',
  //    'street1' : '1 CITY HALL SQ',
  //    'city' : 'BOSTON',
  //    'state' : 'MA',
  //    'zip' : '02201',
  //    'country' : 'US',
  //    'phone' : '+1 555 321 9393',
  //    'email' : 'cesar@goshippo.com'
  //  }).then(function(address1){
  //
  //
  // shippo.address.create({
  //  'object_purpose' : 'PURCHASE',
  //  'name' : 'Mr Hippo',
  //  'company' : 'SF Zoo',
  //  'street1' : '2945 Sloat Blvd',
  //  'city' : 'San Francisco',
  //  'state' : 'CA',
  //  'zip' : '94132',
  //  'country' : 'US',
  //  'phone' : '+1 555 341 9393',
  //  'email' : 'mrhippo@goshippo.com'
  // }).then(function(address){
  //
  //   shippo.parcel.create({
  //       "length": "5",
  //       "width": "5",
  //       "height": "5",
  //       "distance_unit": "cm",
  //       "weight": "2",
  //       "mass_unit": "lb",
  //       "template": "",
  //       "metadata": "Customer ID 123456"
  //     }).then(function(parcel){
  //         shippo.customsitem.create({
  //             "description": "T-Shirt",
  //             "quantity": 1,
  //             "net_weight": "400",
  //             "mass_unit": "g",
  //             "value_amount": "20",
  //             "value_currency": "USD",
  //             "tariff_number": "",
  //             "origin_country": "US",
  //             "metadata": "Order ID #123123"
  //         }).then(function(item){
  //           shippo.customsdeclaration.create({
  //             "exporter_reference": "",
  //             "importer_reference": "",
  //             "contents_type": "MERCHANDISE",
  //             "contents_explanation": "T-Shirt purchase",
  //             "invoice": "#123123",
  //             "license": "",
  //             "certificate": "",
  //             "notes": "",
  //             "eel_pfc": "NOEEI_30_37_a",
  //             "aes_itn": "",
  //             "non_delivery_option": "ABANDON",
  //             "certify": true,
  //             "certify_signer": "Shawn Ippotle",
  //             "disclaimer": "",
  //             "incoterm": "",
  //             "items": [item['object_id']],
  //             "metadata": "Order ID #123123"
  //           }).then(function(declaration){
  //               res.json(declaration);
  //               console.log(shippo);
  //           //   shippo.shipment.create({
  //           //       "object_purpose": "PURCHASE",
  //           //       "address_from": address['object_id'],
  //           //       "address_to": address1['object_id'],
  //           //       "parcel": parcel['object_id'],
  //           //       "submission_type": "PICKUP",
  //           //       "submission_date": "2013-12-03T12:00:00.000Z",
  //           //       "insurance_amount": "1",
  //           //       "insurance_currency": "USD",
  //           //       "extra": {},
  //           //       "customs_declaration": declaration['object_id'],
  //           //       "reference_1": "",
  //           //       "reference_2": "",
  //           //       "metadata": "Customer ID 123456",
  //           //       "async": false
  //           //   }).then(function(shipment){
  //           //       res.json(shipment);
  //           // },function myError1(r1) {
  //           //   // res.json(r1);
  //           // });
  //
  //           // label_file_type
  //
  //               // res.json(declaration['object_id'])
  //             },function myError1(r1) {
  //               // res.json(r1);
  //             });
  //
  //
  //           },function myError1(r1) {
  //             // res.json(r1);
  //           });
  //
  //       },function myError2(r2) {
  //         // res.json(r2);
  //       });
  //
  //   },function myError3(r3) {
  //     // res.json(r3);
  //   });
  //
  // },function myError1(r1) {
  //   // res.json(r1);
  // })

})

router.get('/getMyNotifications/:id', function(req, res, next){
  var not = {};
  var n = [];
  var itt = [];

  var iT = {};
  var uS = {};
  // Notifications.find({$and:[{member:req.params.id},{news:{$gt:0}}]} ,function(err, noti){
  Notifications.find({member:req.params.id} ,function(err, noti){
    if(noti){
      not['notifi'] = noti;
      for (var i = 0; i < noti.length; i++) {
        n.push(noti[i]['user']);
        itt.push(noti[i]['item']);
      }
      Users.find( {$and:[{_id : {$in:n}}]},function(err, u){
        for (var i = 0; i < u.length; i++) {
          uS[ u[i]['_id'] ] = u[i];
        }
        not['member'] = uS;
        Items.find( {_id : {$in:itt}},function(err, ite){
          for (var i = 0; i < ite.length; i++) {
            iT[ ite[i]['_id'] ] = ite[i];
          }
          not['items'] = iT;
          Notifications.update({}, { $set:{news:0} }, {multi:true},function(e,g){
            res.json(not);
          });
        })
      })
    }
    else{
      not['notifi'] = noti;
      not['member'] = {};
      not['items'] = {}
      res.json(not);
    }
    }).sort({id:-1})

})

router.get('/borrar', function(req, res, next){
  // var filePath = "uploads/null";
  // fs.unlinkSync(filePath);
  // res.json(true);
});

router.post('/uploadPicImg', function(req, res, next){
  var form = new multiparty.Form({autoFiles:true, uploadDir:'public/images/'});
  form.parse(req, function(err, fields, files) {
    res.json(files['file'][0]['path']);
  })
})

router.post('/uploadPicProfile/:id', function(req, res, next){
  var form = new multiparty.Form({autoFiles:true, uploadDir:'public/images/'});
  console.log(req.body);
  // for(var req.body in bod){
    // console.log(bod);
  // }

  Users.findOne({_id:req.params.id}, function(err, user){
    form.parse(req, function(err, fields, files) {
      if(files){
        var file = files['file'][0]['path'].split('/');
        file = file[2];
        user['image'] = file;
        user.save(function(err, us){
          res.json(file);
        })
      }
    })
  })
})

router.get('/txt', function(req, res, next){
  Closedeals.update({_id:"5731c63b517236a7029896b9"}, {type:1},function(e,g){
    res.json(true);
  });
})

router.post('/saveClosedeals',function(req, res, next){

  var dataNtf = new Closedeals(req.body);
  var dataNtf2 = new Closedeals(req.body);
  dataNtf2['user'] = dataNtf2['member'];
  dataNtf2['member'] = dataNtf2['user']

  dataNtf.save(function(err, noti){
    dataNtf2.save(function(err, n){
      if(dataNtf['type'] == 1){
        var rate = new Closedeals(req.body);
        rate['type'] = 2;
        rate.save(function(err, not){
          res.json(true);
        })
      }
      else{
        res.json(true);
      }
    })
  })
})

router.get('/deleteClosedeals/:id', function(req, res, next){
  Closedeals.remove({_id:req.params.id}, function(err){
    res.json(true);
  })
})

router.post('/rate/:id', function(req, res, next){
  Users.findOne({_id:req.body.user},function(err, user) {
    var count = user['sales'] + user['swaps'];
    user['star'] = ( user['star'] + req.body.rate ) / count;
    user.save(function(err, user){
      Closedeals.remove({_id:req.params.id}, function(err){
        res.json(true);
      })
    })
  })
})

router.post('/register', function(req, res, next) {
  var returnUser = {};
  var newUser = new Users(req.body);
  Users.find({$or:[ {email : newUser.email}, {username : newUser.username} ]},function(err, users) {
    if(users.length > 0){
      res.json(false);
    }
    else{
      newUser.save(function(err, user){
        returnUser['user'] = user;
        returnUser['follower'] = 0;
        returnUser['following'] = 0;

        var transporter = nodemailer.createTransport(smtpConfig);
        var text = "Welcome! Now you’re all set to sell, buy and swap your pre-loved fashion. <br><br>We hope you’ll enjoy it! Before getting started don’t hesitate to review the features of the app here.<br><br>Gail & Judy<br><br><br>Here should link to our web site on the FAQ section.";
        var mailOptions = {
            from: '"Gail and Judy" <clem@gailandjudy.com>', // sender address
            to: user['email'], // list of receivers
            subject: 'Welcome from Gail & Judy', // Subject line
            html: '<body style="width: 100%;max-width: 600px;margin: 0 auto;font-family: arial;">'+
            	'<header style="width: 100%;height: 85px;background-image: url(http://45.33.94.253:3030/images/Header.png);background-repeat: no-repeat;"></header>'+
            	'<section style="float: left;width: 100%;padding: 50px;background: white;">'+
              text+
              '</section>'+
            	'<footer style="float: left;width: 100%;height: 320px;background-image: url(http://45.33.94.253:3030/images/footer.png);background-repeat: no-repeat;padding: 50px 0;">'+
            		'<table style="text-align: center;vertical-align: middle; width:250px; margin:0 auto; color:#ae1721;border-spacing: 10px;">'+
            			'<tr>'+
            				'<td colspan="2">Download the app today</td>'+
            			'</tr>'+
            			'<tr>'+
            				'<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src=(http://45.33.94.253:3030/images/Applestore.png"></td>'+
            				'<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src=(http://45.33.94.253:3030/images/Googleplay.png"></td>'+
            			'</tr>'+
            			'<tr>'+
            				'<td colspan="2">Follow us on social media</td>'+
            			'</tr>'+
            			'<tr>'+
            				'<td colspan="2">'+
            					'<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Facebook.png">'+
            					'<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Twitter.png">'+
            					'<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Google.png">'+
            				'</td>'+
            			'</tr>'+
            			'<tr style="font-size:12px;">'+
            				'<td><a style="color:#ae1721;text-decoration:none;" href="http://www.bepurpledash.com">UNSUBSCRIBE</a></td>'+
            				'<td><a style="color:#ae1721;text-decoration:none;" href="http://www.bepurpledash.com">PRIVACY POLICY</a></td>'+
            			'</tr>'+
            			'<tr style="font-size:12px;">'+
            				'<td colspan="2">@2016 Gail & Judy. All rights reserved.</td>'+
            			'</tr>'+
            		'</table>'+
            	'</footer>'+
            '</body>'
        };

        transporter.sendMail(mailOptions, function(error, info){
            res.json(returnUser);
        });
      })
    }
  })
});

router.post('/loginFacebook', function(req, res, next){
  var dataUser = req.body;
  var u = {};
  var returnUser = {};
  Users.find({email : dataUser.email} ,function(err, users) {
    if(users.length > 0){
      u['user'] = users[0];
      Follows.count({ user: users[0]['_id']}, function(e,following){
        u['following'] = following;
        Follows.count({ follow: users[0]['_id']}, function(e,follower){
          u['follower'] = follower;
          u['old'] = 1;
          res.json(u);
        })
      })
    }
    else{
      var newUser = new Users(req.body);
      newUser.save(function(err, usr){
        u['old'] = 0;
        u['user'] = usr;
        u['follower'] = 0;
        u['following'] = 0;
        res.json(u);
      })
    }
  })
})

router.post('/login', function(req, res, next) {
  var dataUser = new Users(req.body);
  var u = {};
  Users.find( {$or:[{email : dataUser.email}, {username : dataUser.email}] },function(err, users) {
    if(users.length > 0){
      if(users[0].password == dataUser.password){
        u['user'] = users[0];
        Follows.count({ user: users[0]['_id']}, function(e,following){
          u['following'] = following;
          Follows.count({ follow: users[0]['_id']}, function(e,follower){
            u['follower'] = follower;
            res.json(u);
          })
        })
      }
      else{
        res.json(false);
      }
    }
    else{
      console.log('else')
      res.json(false);
    }
  })
});

router.post('/addItem', function(req, res, next) {
  var dataItem = new Items(req.body);
  dataItem.save(function(err, item){
    if(err){return next(err)}
    res.json(true);
  })
});

router.get('/getUpdated/:id', function(req, res, next){
  var idUser = req.params.id;
  var retr = {};
  Notifications.count({$and:[{member:idUser},{news:{$gt:0}}]} , function(err, noti){
    retr['notify'] = noti;
    Follows.count({follow:idUser}, function(er, foll){
      retr['follow'] = foll;
      res.json(retr);
    })
  })
  // }).limit(1).sort({$natural:-1})
})

router.post('/likeItem', function(req,res,next){
  var dataLike = new Likes(req.body);

  Likes.findOne({$and:[ {user : dataLike['user']}, {item : dataLike['item']} ]},function(err, like){
    if(like){
      Likes.remove({$and:[ {user : dataLike['user']}, {item : dataLike['item']} ]}, function(er, like){
        Items.findOne( {$and:[{_id: dataLike['item']},{active:1}]},function(e, item){
          item['likes'] = item['likes'] - 1;
          item.save(function(e){
            Ignores.remove({$and:[ {user : dataLike['user']}, {owner : dataLike['owner']} ]}, function(er, ign){
              res.json(item['likes']);
            })
          });
        })
      })
    }
    else{
      dataLike.save(function(err, like){
        Items.findOne({$and:[{_id: dataLike['item']},{active:1}]},function(e, item){
          item['likes'] = item['likes'] + 1;
          item.save(function(e){
            Notifications.find({user:dataLike['owner']},function(err, noti){
              var upNews = 1;
              if(noti.length > 0){
                upNews = noti[0]['news'] + 1;
              }
              item.save(function(e){
                var notifications = new Notifications({
                  user: dataLike['user'],
                  member: item['user'],
                  action: "likes your",
                  size: 30,
                  icon: "assets/lovinmeRed.png",
                  item: item['_id'],
                  news: upNews
                })
                notifications.save(function(e){
                  Items.count( {$and:[{user: dataLike['owner']},{active:1}]},function(e, allHItems){
                    Likes.count({$and:[{owner: dataLike['owner']},{user:dataLike['user']}]}, function(err, allMLikes){
                      if(allHItems == allMLikes){
                      	var g = {user: dataLike['user'],owner: dataLike['owner']};
                        var ig = new Ignores(g)
                        ig.save(function(eror){
                          res.json(item['likes']);
                        })
                      }
                      else{
                        res.json(item['likes']);
                      }
                    })
                  });
                });
              });
            }).limit(1).sort({$natural:-1})
          });
        })
      })
    }
  })
})

router.get('/forgot/:email', function(req, res, next) {
  var emailUser = req.params.email;
  // var emailUser = req.body;

  Users.findOne({email : emailUser},function(err, users) {
    var transporter = nodemailer.createTransport(smtpConfig);
    var text = "This is your password:<br><br><br><h1>"+users.password+"</h1>";
    var mailOptions = {
        from: '"Gail and Judy" <clem@gailandjudy.com>', // sender address
        to: emailUser, // list of receivers
        subject: 'Reset your password', // Subject line
        html: '<body style="width: 100%;max-width: 600px;margin: 0 auto;font-family: arial;">'+
          '<header style="width: 100%;height: 85px;background-image: url(http://45.33.94.253:3030/images/Header.png);background-repeat: no-repeat;"></header>'+
          '<section style="float: left;width: 100%;padding: 50px;background: white;">'+
          text+
          '</section>'+
          '<footer style="float: left;width: 100%;height: 320px;background-image: url(http://45.33.94.253:3030/images/footer.png);background-repeat: no-repeat;padding: 50px 0;">'+
            '<table style="text-align: center;vertical-align: middle; width:250px; margin:0 auto; color:#ae1721;border-spacing: 10px;">'+
              '<tr>'+
                '<td colspan="2">Download the app today</td>'+
              '</tr>'+
              '<tr>'+
                '<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src=(http://45.33.94.253:3030/images/Applestore.png"></td>'+
                '<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src=(http://45.33.94.253:3030/images/Googleplay.png"></td>'+
              '</tr>'+
              '<tr>'+
                '<td colspan="2">Follow us on social media</td>'+
              '</tr>'+
              '<tr>'+
                '<td colspan="2">'+
                  '<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Facebook.png">'+
                  '<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Twitter.png">'+
                  '<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Google.png">'+
                '</td>'+
              '</tr>'+
              '<tr style="font-size:12px;">'+
                '<td><a style="color:#ae1721;text-decoration:none;" href="http://www.bepurpledash.com">UNSUBSCRIBE</a></td>'+
                '<td><a style="color:#ae1721;text-decoration:none;" href="http://www.bepurpledash.com">PRIVACY POLICY</a></td>'+
              '</tr>'+
              '<tr style="font-size:12px;">'+
                '<td colspan="2">@2016 Gail & Judy. All rights reserved.</td>'+
              '</tr>'+
            '</table>'+
          '</footer>'+
        '</body>'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
           console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
    res.json(true)
  })



});

router.post('/sendEmail/:id/:user', function(req,res,next){
  Users.findOne({_id:req.params.id}, function(err, user){

    var transporter = nodemailer.createTransport(smtpConfig);

    var text = "Hi, this is Gail and Judy. You received a new message from "+req.body.Name;
    var message = "Message: "+req.body.Message;
    var footer = "Connect to the app to know more."

    var mailOptions = {
        from: '"Gail and Judy" <clem@gailandjudy.com>', // sender address
        to:user['email'], // list of receivers
        subject: 'New message from '+req.body.Name, // Subject line
        html: '<body style="width: 100%;max-width: 600px;margin: 0 auto;font-family: arial;">'+
        	'<header style="width: 100%;height: 85px;background-image: url(http://45.33.94.253:3030/images/Header.png);background-repeat: no-repeat;"></header>'+
        	'<section style="float: left;width: 100%;padding: 50px;background: white;">'+
          text+
          '<br /><br />'+
          message+
          '<br /><br />'+
          footer+
          '</section>'+
        	'<footer style="float: left;width: 100%;height: 320px;background-image: url(http://45.33.94.253:3030/images/footer.png);background-repeat: no-repeat;padding: 50px 0;">'+
        		'<table style="text-align: center;vertical-align: middle; width:250px; margin:0 auto; color:#ae1721;border-spacing: 10px;">'+
        			'<tr>'+
        				'<td colspan="2">Download the app today</td>'+
        			'</tr>'+
        			'<tr>'+
        				'<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src=(http://45.33.94.253:3030/images/Applestore.png"></td>'+
        				'<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src=(http://45.33.94.253:3030/images/Googleplay.png"></td>'+
        			'</tr>'+
        			'<tr>'+
        				'<td colspan="2">Follow us on social media</td>'+
        			'</tr>'+
        			'<tr>'+
        				'<td colspan="2">'+
        					'<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Facebook.png">'+
        					'<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Twitter.png">'+
        					'<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Google.png">'+
        				'</td>'+
        			'</tr>'+
        			'<tr style="font-size:12px;">'+
        				'<td><a style="color:#ae1721;text-decoration:none;" href="http://www.bepurpledash.com">UNSUBSCRIBE</a></td>'+
        				'<td><a style="color:#ae1721;text-decoration:none;" href="http://www.bepurpledash.com">PRIVACY POLICY</a></td>'+
        			'</tr>'+
        			'<tr style="font-size:12px;">'+
        				'<td colspan="2">@2016 Gail & Judy. All rights reserved.</td>'+
        			'</tr>'+
        		'</table>'+
        	'</footer>'+
        '</body>'
        // html body
    };
    // console.log(mailOptions);

    transporter.sendMail(mailOptions, function(error, info){
   		 Users.findOne({_id:req.params.user}, function(err, user2){

      var transporter2 = nodemailer.createTransport(smtpConfig);

      var text = "Hi, this is Gail and Judy.<br> You sent a new message to "+user['username']+"successfully.";
      var message = "Message: "+req.body.Message;
      var footer = "Connect to the app to know more."

      var mailOptions2 = {
          from: '"Gail and Judy" <clem@gailandjudy.com>', // sender address
          to:user2['email'], // list of receivers
          subject: 'Sent message to '+user['username'], // Subject line
          html: '<body style="width: 100%;max-width: 600px;margin: 0 auto;font-family: arial;">'+
            '<header style="width: 100%;height: 85px;background-image: url(http://45.33.94.253:3030/images/Header.png);background-repeat: no-repeat;"></header>'+
            '<section style="float: left;width: 100%;padding: 50px;background: white;">'+
            text+
            '<br /><br />'+
            message+
            '<br /><br />'+
            footer+
            '</section>'+
            '<footer style="float: left;width: 100%;height: 320px;background-image: url(http://45.33.94.253:3030/images/footer.png);background-repeat: no-repeat;padding: 50px 0;">'+
              '<table style="text-align: center;vertical-align: middle; width:250px; margin:0 auto; color:#ae1721;border-spacing: 10px;">'+
                '<tr>'+
                  '<td colspan="2">Download the app today</td>'+
                '</tr>'+
                '<tr>'+
                  '<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src=(http://45.33.94.253:3030/images/Applestore.png"></td>'+
                  '<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src=(http://45.33.94.253:3030/images/Googleplay.png"></td>'+
                '</tr>'+
                '<tr>'+
                  '<td colspan="2">Follow us on social media</td>'+
                '</tr>'+
                '<tr>'+
                  '<td colspan="2">'+
                    '<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Facebook.png">'+
                    '<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Twitter.png">'+
                    '<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Google.png">'+
                  '</td>'+
                '</tr>'+
                '<tr style="font-size:12px;">'+
                  '<td><a style="color:#ae1721;text-decoration:none;" href="http://www.bepurpledash.com">UNSUBSCRIBE</a></td>'+
                  '<td><a style="color:#ae1721;text-decoration:none;" href="http://www.bepurpledash.com">PRIVACY POLICY</a></td>'+
                '</tr>'+
                '<tr style="font-size:12px;">'+
                  '<td colspan="2">@2016 Gail & Judy. All rights reserved.</td>'+
                '</tr>'+
              '</table>'+
            '</footer>'+
          '</body>'
          // html body
      };
      // console.log(mailOptions);

      transporter2.sendMail(mailOptions2, function(error2, info2){
              console.log('Message sent: ' + info.response);
              console.log(error2)
	    res.json(true)
      });
    })
    });

  })
})

router.post('/sendUsEmail', function(req,res,next){
  // { Name: 'Hh', Username: 'vv', Message: 'Hvh' }
    // console.log(req.body);
    // var smtpConfig = {
    //     host: 'sc2.conectarhosting.com',
    //     port: 465,
    //     secure: true, // use SSL
    //     auth: {
    //         user: 'cesar@cahl.com.ve',
    //         pass: '7819920'
    //     }
    // };

    var transporter = nodemailer.createTransport(smtpConfig);
    var text = "From the user: "+req.body.Name+". Consult: "+req.body.Message;
    var mailOptions = {
        from: '"Gail And Judy" <clem@gailandjudy.com>', // sender address
        to: 'clem@gailandjudy.com', // list of receivers
        subject: 'Contact Us', // Subject line
        html: '<body style="width: 100%;max-width: 600px;margin: 0 auto;font-family: arial;">'+
          '<header style="width: 100%;height: 85px;background-image: url(http://45.33.94.253:3030/images/Header.png);background-repeat: no-repeat;"></header>'+
          '<section style="float: left;width: 100%;padding: 50px;background: white;">'+
          text+
          '</section>'+
          '<footer style="float: left;width: 100%;height: 320px;background-image: url(http://45.33.94.253:3030/images/footer.png);background-repeat: no-repeat;padding: 50px 0;">'+
            '<table style="text-align: center;vertical-align: middle; width:250px; margin:0 auto; color:#ae1721;border-spacing: 10px;">'+
              '<tr>'+
                '<td colspan="2">Download the app today</td>'+
              '</tr>'+
              '<tr>'+
                '<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src=(http://45.33.94.253:3030/images/Applestore.png"></td>'+
                '<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src=(http://45.33.94.253:3030/images/Googleplay.png"></td>'+
              '</tr>'+
              '<tr>'+
                '<td colspan="2">Follow us on social media</td>'+
              '</tr>'+
              '<tr>'+
                '<td colspan="2">'+
                  '<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Facebook.png">'+
                  '<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Twitter.png">'+
                  '<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src=(http://45.33.94.253:3030/images/Google.png">'+
                '</td>'+
              '</tr>'+
              '<tr style="font-size:12px;">'+
                '<td><a style="color:#ae1721;text-decoration:none;" href="http://www.bepurpledash.com">UNSUBSCRIBE</a></td>'+
                '<td><a style="color:#ae1721;text-decoration:none;" href="http://www.bepurpledash.com">PRIVACY POLICY</a></td>'+
              '</tr>'+
              '<tr style="font-size:12px;">'+
                '<td colspan="2">@2016 Gail & Judy. All rights reserved.</td>'+
              '</tr>'+
            '</table>'+
          '</footer>'+
        '</body>'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
    	res.json(true)
        console.log('Message sent: ' + info.response);
    });
})

router.post('/uploadImg', function(req,res,next){
  var form = new multiparty.Form({autoFiles:true, uploadDir:'uploads/'});

  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }
    res.json(true);




          // res.writeHead(200, {'content-type': 'text/plain'});
          // console.log('received fields:\n\n '+util.inspect(fields));
          // res.write('\n\n');
          //  console.log('received files:\n\n '+util.inspect(files));
  });
})

router.post('/follow', function(req,res,next){
  var newFollow = new Follows(req.body);
  Follows.findOne({$and:[ {user : newFollow['user']}, {follow : newFollow['follow']} ]},function(err, follow) {
    if(follow){
      Follows.remove({_id:follow._id}, function(err){
        res.json(true);
      })
    }
    else{
      newFollow.save(function(err, f){
        if(err){return next(err)}
        res.json(true);
      })
    }
  })
})

// router.post('/declineNewMatch', function(req, res, next){
//   var saveMatch = new Matchs(req.body);
//   saveMatch.save(function(err, f){
//     if(err){return next(err)}
//     res.json(true);
//   })
// })

router.post('/saveMatch', function(req, res, next){
  var saveMatch = new Matchs(req.body);
  saveMatch.save(function(err, f){
    if(saveMatch['status1'] == 2){
      Notifications.find({user:saveMatch['userA']},function(err, noti){
        var upNews = 0;
        if(noti){
          upNews = noti[0]['news'] + 1;
        }
        var notifications = new Notifications({
          user: saveMatch['userA'],
          member: saveMatch['userB'],
          action: "declined the swap with your",
          size: 30,
          icon: "assets/declinedMatch.png",
          item: saveMatch['itemB1'],
          news: upNews
        })
        notifications.save(function(e){
          res.json(true);
        });
      }).limit(1).sort({$natural:-1})
    }
    else{
      Notifications.find({user:saveMatch['userA']},function(err, noti){
        var upNews = 0;
        if(noti){
          upNews = noti[0]['news'] + 1;
        }
        var notifications = new Notifications({
          user: saveMatch['userA'],
          member: saveMatch['userB'],
          action: "approved the match with your",
          size: 30,
          icon: "assets/acceptMatch.png",
          item: saveMatch['itemB1'],
          news: upNews
        })
        notifications.save(function(e){
          res.json(true);
        });
      }).limit(1).sort({$natural:-1})
    }
  })
})

router.post('/search/:id', function(req, res, next){
  var respon = {};
  var search = [];
  var bod = req.body;
  var lik = [];
  var talles = [];
  var qry;
  for(var attributename in bod){
    if(bod[attributename] != "" && bod[attributename] != "size" && bod[attributename] != "size2" && bod[attributename] != "size3"){
      var ss = {};
      ss[attributename] = bod[attributename];
      search.push(ss);
    }
  }
  if(typeof bod["size"] !== 'undefined' && bod["size"] != ""){
    talles.push(bod["size"]);
  }
  if(typeof bod["size2"] !== 'undefined' && bod["size2"] != ""){
    talles.push(bod["size2"]);
  }
  if(typeof bod["size3"] !== 'undefined' && bod["size3"] != ""){
    talles.push(bod["size3"]);
  }
  // Items.find({$and:search[0],$and:[{size:{$in:talles}}]}, function(err, items){
  if(search.length > 1){
    Items.find({$and:search}, function(err, items){
      respon['items'] = items;
      if(items){
        if(talles.length > 0){
          for (var i = 0; i < items.length; i++) {
            var bdra = 0;
            for (var x1 = 0; x1 < talles.length; x1++) {
              if(items[i]['size'] == talles[x1]){
                bdra = 1;
              }
            }
            if(bdra == 1){
              lik.push(items[i]['_id']);
            }
          }
        }
        else{
          for (var i = 0; i < items.length; i++) {
            lik.push(items[i]['_id']);
          }
        }
      }
      Likes.find({$and:[{item:{$in:lik}},{user:req.params.id}]},function(err, allMyLikes){
        respon['likes'] = allMyLikes;
        res.json(respon);
      })
    })
   }
   if(search.length == 1){
     var qr = search[0]
     Items.find(qr, function(err, items){
       respon['items'] = items;
       if(items){
         if(talles.length > 0){
           for (var i = 0; i < items.length; i++) {
             var bdra = 0;
             for (var x1 = 0; x1 < talles.length; x1++) {
               if(items[i]['size'] == talles[x1]){
                 bdra = 1;
               }
             }
             if(bdra == 1){
               lik.push(items[i]['_id']);
             }
           }
         }
         else{
           for (var i = 0; i < items.length; i++) {
             lik.push(items[i]['_id']);
           }
         }
       }
       Likes.find({$and:[{item:{$in:lik}},{user:req.params.id}]},function(err, allMyLikes){
         respon['likes'] = allMyLikes;
         res.json(respon);
       })
     })
   }
   //
  //  if(search.length > 1 && talles.length > 0){
  //    console.log('if1');
  //    Items.find({$and:search,$and:[{size:{$in:talles}}]}, function(err, items){
  //      respon['items'] = items;
  //      if(items){
  //        for (var i = 0; i < items.length; i++) {
  //          lik.push(items[i]['_id']);
  //        }
  //      }
  //      Likes.find({$and:[{item:{$in:lik}},{user:req.params.id}]},function(err, allMyLikes){
  //        respon['likes'] = allMyLikes;
  //        res.json(respon);
  //      })
  //    })
  //   }
  //   if(search.length == 1 && talles.length > 0){
  //     console.log('if2');
  //     var qr = search[0]
  //     Items.find(qr,$and:[{size:{$in:talles}}], function(err, items){
  //       respon['items'] = items;
  //       if(items){
  //         for (var i = 0; i < items.length; i++) {
  //           lik.push(items[i]['_id']);
  //         }
  //       }
  //       Likes.find({$and:[{item:{$in:lik}},{user:req.params.id}]},function(err, allMyLikes){
  //         respon['likes'] = allMyLikes;
  //         res.json(respon);
  //       })
  //     })
  //   }

})

router.get('/getAMatch/:id/:user', function(req, res, next) {
  var items = [];
  var itemReor = {};
  var matchSaved = {}
  var idUser;
  Matchs.find({ _id: req.params.id },function(err, matchs){

    if( req.params.user == matchs[0]['userA'] ){
      idUser = matchs[0]['userB'];
    }
    else{
      idUser = matchs[0]['userA'];
    }
    matchSaved['matchs'] = matchs;
    if(matchs){
      for (var i = 0; i < matchs.length; i++) {
        items.push(matchs[i]['itemA1']);
        items.push(matchs[i]['itemB1']);
        if(matchs[i]['itemB2']){
          items.push(matchs[i]['itemB2']);
          if(matchs[i]['itemB3'])
          items.push(matchs[i]['itemB3']);
        }
        if(matchs[i]['itemA2']){
          items.push(matchs[i]['itemA2']);
          if(matchs[i]['itemA3'])
          items.push(matchs[i]['itemA3']);
        }
      }
    }

    Items.find( {$and:[{_id:{$in:items}},{active:1}]},function(err, allItems){
      for (var i = 0; i < allItems.length; i++) {
        itemReor[allItems[i]['_id']] = allItems[i];
      }
      matchSaved['items'] = itemReor;
      Items.find( {$and:[{user: idUser},{active:1}]},function(err, allItems){
        matchSaved['AllItems'] = allItems;
        Users.findOne({_id: idUser},function(err, user){
          matchSaved['User'] = user;
          res.json(matchSaved);
        })
      })
    })
  })
});


router.get('/deleteMyItem/:id', function(req, res, next) {
  Items.findOne({_id:req.params.id},function(err, myItem){
    myItem['active'] = 0;
    myItem.save(function(e){
      res.json(true);
    });
  })
});


router.get('/getMyItems/:id', function(req, res, next) {
  Items.find({$and:[{user:req.params.id},{active:1}]},function(err, myItems){
    if(err){return next(err)}
    res.json(myItems);
  })
});

router.get('/getYourItems/:id/:user', function(req, res, next) {
  var dt = {};
  Items.find({$and:[{user:req.params.id},{active:1}]},function(err, myItems){
    dt['Items'] = myItems;
    Users.findOne({_id:req.params.id}, function(e, user){
      dt['User'] = user;
      Likes.find(  {$and:[{owner:req.params.id},{user:req.params.user}]}, function(e, lik){
        dt['Likes'] = lik;
        Follows.findOne(  {$and:[{follow:req.params.id},{user:req.params.user}]}, function(e, follow){
          dt['Follow'] = follow;
          Follows.count({ user: req.params.id}, function(e,following){
            dt['following'] = following;
            Follows.count({ follow: req.params.id}, function(e,follower){
              dt['follower'] = follower;
              res.json(dt);
            })
          })
        })
      })
    })
  })
});

router.get('/getBrands', function(req, res, next) {
  Brands.find({},function(err, brands){
    if(err){return next(err)}
    res.json(brands);
  })
  // .skip(325);
});

router.get('/getUser/:id', function(req, res, next) {
  var us = {};
  Users.findOne({_id: req.params.id},function(err, user){
    us['user'] = user;
    Follows.count({ user: req.params.id}, function(e,following){
      us['following'] = following;
      Follows.count({ follow: req.params.id}, function(e,follower){
        us['follower'] = follower;
        console.log(us);
        res.json(us);
      })
    })
  })
});

router.get('/listMatchSaved/:id', function(req, res, next){
  var items = [];
  var itemReor = {};
  var matchSaved = {}
  Matchs.find({ $and:[{$or:[{userA:req.params.id},{userB:req.params.id}]}]},function(err, matchs){
    matchSaved['matchs'] = matchs;
    if(matchs){
      for (var i = 0; i < matchs.length; i++) {
        items.push(matchs[i]['itemA1']);
        items.push(matchs[i]['itemB1']);
        if(matchs[i]['itemB2']){
          items.push(matchs[i]['itemB2']);
          if(matchs[i]['itemB3']){
            items.push(matchs[i]['itemB3']);
          }
        }
        if(matchs[i]['itemA2']){
          items.push(matchs[i]['itemA2']);
          if(matchs[i]['itemA3']){
            items.push(matchs[i]['itemA3']);
          }
        }
      }
    }
    if(items){
      for (var i = 0; i < items.length; i++) {
        items[i] = items[i].toString();
      }
    }
    Items.find({  $and:[{_id:{$in:items}},{active:1}]},function(err, allItems){
      if(allItems){
        for (var i = 0; i < allItems.length; i++) {
          itemReor[allItems[i]['_id']] = allItems[i];
        }
        matchSaved['items'] = itemReor;
        res.json(matchSaved);
      }
    })
  })
})

router.get('/disabledLove/:id', function(req, res, next){
  Items.findOne({_id:req.params.id}, function(err, item){
    item['loveActive'] = 0;
    item.save(function(e){
      res.json(true);
    });
  })
})

router.get('/sumLess/:id', function(req, res, next){
  Items.findOne({_id:req.params.id}, function(err, item){
    item['skip'] = item['skip'] + 1;
    item.save(function(e){
      res.json(true);
    });
  })
})

router.get('/detailsloveme/:id/:skip/:user',function(req,res,next){
  var ignoreUser = [];
  var us = [];
  var result = {};
  var back = {};
  var sLike = [];
  var owner;
  Ignores.find({user:req.params.user}, function(err, ignore){
    if(ignore){
      for (var i = 0; i < ignore.length; i++) {
        ignoreUser.push(ignore[i].user);
      }
    }

    Likes.find( {$and:[ {item:req.params.id},{user:{$nin:ignore}} ]}, function(er, like){
      if(like){
        owner = like[0].owner;
        for (var ii = 0; ii < like.length; ii++) {
          us.push(like[ii].user);
        }
      }
      Items.find({$and:[{user:{$in:us}},{active:1}]},  function(e,it){
        if(it){
          for (var iii = 0; iii < it.length; iii++) {
            result[ it[iii]['user'] ] = {};
          }
          for (var iii = 0; iii < it.length; iii++) {
            sLike.push(it[iii]['_id']);
            result[it[iii]['user']][iii] = it[iii];
          }
        }
        back['items'] = result;
        Likes.find({$and:[{item:{$in:sLike}},{user:owner}]},function(err, allMyLikes){
          back['likes'] = allMyLikes;
          res.json(back);
        })
      }).skip(parseInt(req.params.skip, 10));
    })
  })
})

router.get('/getBrandsWellcome',function(req,res,next){
  Brands.find({favorite:1},function(err, brands){
    if(err){return next(err)}
    res.json(brands);
  })
})

router.get('/listMatchs/:id', function(req, res, next){
  var owners = [];
  var items = {};
  var it = {};
  var idIt = [];
  var itemReor = {};
  Likes.find( {owner: req.params.id}  ,function(err, myLik){
    items['myItems'] = myLik;
    if(myLik){
      for (var i = 0; i < myLik.length; i++) {
        owners.push(myLik[i]['user']);
        idIt.push(myLik[i]['item']);
      }
      Likes.find(   { $and:[ { user: req.params.id}, { owner: {$in:owners} } ] } ,function(err, yourLik){
        for (var i = 0; i < yourLik.length; i++) {
          idIt.push(yourLik[i]['item']);
          it[i] = yourLik[i];
          // it[i][yourLik[i]['owner']] = yourLik[i];
        }
        items['yourItems'] = it;
        Items.find({$and:[{_id:{$in:idIt}},{active:1}]},function(err, allItems){
          Closedeals.find({user:req.params.id}, function(err, noti){
            items['closedeals'] = noti;
            for (var i = 0; i < allItems.length; i++) {
              itemReor[allItems[i]['_id']] = allItems[i];
            }
            items['items'] = itemReor;
            Users.find({_id:{$in:owners}}, function(err, uer){
              var ur = {};
              for (var i = 0; i < uer.length; i++) {
                ur[uer[i]['_id']] = uer[i];
              }
              items['us'] = ur;
              res.json(items);
            })
          })
        })
      })
    }
  })
})

router.get('/getFeeds/:id', function(req, res, next) {
  var feeds = {};
  Items.find( {$and:[{user: {$ne: req.params.id}},{active:1}]},function(err, items){
    if(err){return next(err)}
    feeds['items'] = items;
    Likes.find({user: req.params.id},function(err, likes){
      feeds['likes'] = likes;
      res.json(feeds);
    })
  })
});

router.get('/getMylove/:id', function(req, res, next) {
  var myLoves = [];
  Likes.find({user: req.params.id},function(err, lik){
    for (var i = 0; i < lik.length; i++) {
      myLoves.push(lik[i]['item']);
    }
    Items.find( {$and:[{_id : {$in:myLoves}},{active:1}]},function(err, it){
      res.json(it);
    })
  })
});

router.get('/getLovinme/:id', function(req, res, next) {
  var It = [];
  var Us = [];
  var Lovinme = {};

  var ItemIndex = {};
  var UserIndex = {};
  var ignoreUser = [];

  Ignores.find({user:req.params.id}, function(err, ignore){
    if(ignore){
      for (var i = 0; i < ignore.length; i++) {
        ignoreUser.push(ignore[i].owner);
      }
    }
    Items.find({$and:[{user : req.params.id},{ active:1}]},function(err, item){
      if(item){
        for (var i = 0; i < item.length; i++) {
          ItemIndex[item[i]['_id']] = item[i];
          It.push(item[i]['_id']);
        }
      }
      Lovinme['Item'] = ItemIndex;
      Likes.find( {$and:[ {item: {$in:It}},{user:{$nin:ignore}} ]}, function(e, like){
        if(like){
          for (var i = 0; i < like.length; i++) {
            var ige = 0;
            for (var i2 = 0; i2 < ignoreUser.length; i2++) {
              if(ignoreUser[i2] == like[i]['user']){
                ige = 1;
              }
            }
            if(ige == 0){
              Us.push(like[i]['user']);
            }
          }
        }
        Lovinme['Like'] = like;
        Users.find({_id: {$in:Us}}, function(er,user){
          if(user){
            for (var i = 0; i < user.length; i++) {
              UserIndex[user[i]['_id']] = user[i];
            }
          }
          Lovinme['User'] = UserIndex;
          res.json(Lovinme);
        })
      })
    })
  })
});

router.get('/detailsItem/:id/:user', function(req,res,next){
  var details = {};
  var posibleLike = [];
  Items.findOne( {$and:[{_id: req.params.id},{active:1}]},function(err, item){
    details['item'] = item;
    Users.findOne({_id: item['user']},function(err, user){
      details['user'] = user;
      Likes.findOne({$and:[ {user : req.params.user}, {item : req.params.id} ]},function(err, like){
        if(like){
          details['like'] = true;
        }
        else{
          details['like'] = false;
        }
        Items.find({$and: [{user: item['user']} , {'_id': {$ne:req.params.id}}] },function(err, items){

        // Items.find({$and: {user: item['user']} , {'_id': $ne:{'_id':req.params.id}} },function(err, items){
          if(items){
            for (var i = 0; i < items.length; i++) {
              posibleLike.push(items[i]['_id']);
            }
          }
          details['items'] = items;
          Likes.find({$and:[ {user : req.params.user}, {item : {$in:posibleLike}} ]},function(err, lk){
            details['lik'] = lk;
            res.json(details);
          })
        }).limit(10)
      })
    })
  })
})

router.get('/newMatch/:my/:your', function(req,res,next){
  var details = {};
  Items.findOne( {$and:[{_id: req.params.my},{active:1}]},function(err, item){
    details['my'] = item;
    Items.findOne( {$and:[{_id: req.params.your},{active:1}]},function(err, item2){
      details['your'] = item2;
      Items.find( {$and:[{user: item2.user},{active:1}]},function(err, allItems){
        details['Items'] = allItems;
        Users.findOne({_id: item2.user},function(err, user){
          details['User'] = user;
          res.json(details);
        })
      })
    })
  })
})

router.get('/oneItem/:id', function(req,res,next){
  Items.findOne( {$and:[{_id:req.params.id},{active:1}]},function(err, myItem){
    res.json(myItem);
  })
})

router.get('/getFollow/:id', function(req,res,next){
  var dt = {};
  var ing = [];
  var er = [];
  Follows.find({user:req.params.id},function(e, following){
	  console.log(following)
	  console.log(">>>>>>>")
    for (var i = 0; i < following.length; i++) {
      ing.push(following[i]['follow']);
    }
    Users.find( { _id : { $in : ing } },function(e, userFollowing){
    console.log(userFollowing)
    	  console.log("<<<<<<<<<<<<<<<<<<<")
      dt['Following'] = userFollowing;
      Follows.find({follow:req.params.id},function(err, followers){
      console.log(followers)
          	  console.log("<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>")

        for (var i = 0; i < followers.length; i++) {
          er.push(followers[i]['user']);
        }
        Users.find( { _id : { $in : er } },function(e, userFollowers){
		console.log(userFollowers)
				console.log("<><><><><><><><><><>")

          dt['Followers'] = userFollowers;
          res.json(dt);
        })
      })
    })
  })
})

router.put('/editItem/:id', function(req, res, next) {
  Items.findOne({_id:req.params.id},function(err, myItem){
    // myItem = req.body;

    myItem['title'] = req.body.title;
    myItem['description'] = req.body.description;
    myItem['pricesite'] = req.body.pricesite;
    myItem['priceyour'] = req.body.priceyour;
    myItem['brand'] = req.body.brand;
    myItem['type'] = req.body.type;
    myItem['size'] = req.body.size;
    myItem['sizeID'] = req.body.sizeID;
    myItem['condition'] = req.body.condition;
    myItem['material'] = req.body.material;
    myItem['color'] = req.body.color;
    myItem['img1'] = req.body.img1;
    myItem['img2'] = req.body.img2;
    myItem['img3'] = req.body.img3;

    // myItem['title'] = "hola";
    myItem.save(function(e){
      if(e){return next(e)}
      res.json(true);
    });
  })
});

router.put('/updateMatch/:id', function(req, res, next) {
  var items = [];
  Matchs.findOne({_id:req.params.id},function(err, match){
    var u;
    var m;
    var im;
    if(match['statusA'] == 0){
      im = match['itemA1'];
      u = match['userB'];
      m = match['userA'];
    }
    else{
      im = match['itemB1'];
      u = match['userA'];
      m = match['userB'];
    }

    if( (req.body.statusB == 1) && (req.body.statusA == 1) ){
      match['statusA'] =  req.body.statusA;
      match['statusB'] =  req.body.statusB;
      match['status1'] =  1;

      for (var i = 1; i < 4; i++) {
        if(match["itemA"+i]){
          items.push(match["itemA"+i])
        }
      }
      for (var i = 1; i < 4; i++) {
        if(match["itemA"+i]){
          items.push(match["itemB"+i])
        }
      }

      // Notifications.update({}, { $set:{news:0} }, {multi:true},function(e,g){

      Users.findOne({_id:match['userA']}, function(er, user1){
        user1['swaps'] = user1['swaps'] + 1;
        user1.save(function(e){
          Users.findOne({_id:match['userB']}, function(er, user2){
            user2['swaps'] = user2['swaps'] + 1;
            user2.save(function(e){
              Items.update({_id:{$in:items}}, { $set:{active:0} }, {multi:true}, function(e, it){
                match.save(function(e){
                  Notifications.find({user:u},function(err, noti){
                    var upNews = 0;
                    if(noti){
                      upNews = noti[0]['news'] + 1;
                    }
                    var notifications = new Notifications({
                      user: u,
                      member: m,
                      action: "approved the match with your",
                      size: 30,
                      icon: "assets/acceptMatch.png",
                      item: im,
                      news: upNews
                    })
                    notifications.save(function(e){
                      res.json(true);
                    });
                  }).limit(1).sort({$natural:-1})
                });
              })
            })
          })
        })
      })
    }
    else{
      match['itemA1'] =  req.body.itemA1;
      match['itemA2'] =  req.body.itemA2;
      match['itemA3'] =  req.body.itemA3;
      match['itemB1'] =  req.body.itemB1;
      match['itemB2'] =  req.body.itemB2;
      match['itemB3'] =  req.body.itemB3;
      match['statusA'] =  req.body.statusA;
      match['statusB'] =  req.body.statusB;
      match.save(function(e){

        Notifications.find({user:u},function(err, noti){
          var upNews = 0;
          if(noti){
            upNews = noti[0]['news'] + 1;
          }
          var notifications = new Notifications({
            user: u,
            member: m,
            action: "added an item to you match with your"+ im['title'],
            size: 30,
            icon: "assets/addedItemRed.png",
            item: im,
            news: upNews
          })
          notifications.save(function(e){
            res.json(true);
          });
        }).limit(1).sort({$natural:-1})
      });
    }
  })
});

router.put('/declineMatch/:id', function(req, res, next) {
  Matchs.findOne({_id:req.params.id},function(err, match){
    match['status1'] = 2;
    match.save(function(e){
      var u;
      var m;
      var im;
      if(match['statusA'] == 0){
        im = match['itemA1'];
        u = match['userB'];
        m = match['userA'];
      }
      else{
        im = match['itemB1'];
        u = match['userA'];
        m = match['userB'];
      }
      Notifications.find({user:u},function(err, noti){
        var upNews = 0;
        if(noti){
          upNews = noti[0]['news'] + 1;
        }
        var notifications = new Notifications({
          user: u,
          member: m,
          action: "declined the swap with your",
          size: 30,
          icon: "assets/declinedMatch.png",
          item: im,
          news: upNews
        })
        notifications.save(function(e){
          res.json(true);
        });
      }).limit(1).sort({$natural:-1})
    });
  })
});

router.put('/saveBrands/:id', function(req, res, next) {
  Users.findOne({_id:req.params.id},function(err, user){
    user['brand1'] = req.body.brand1;
    user['brand2'] = req.body.brand2;
    user['brand3'] = req.body.brand3;
    user['brand4'] = req.body.brand4;
    user['brand5'] = req.body.brand5;
    user['brand6'] = req.body.brand6;
    user['brand7'] = req.body.brand7;
    user['brand8'] = req.body.brand8;
    user['brand9'] = req.body.brand9;
    user['brand10'] = req.body.brand10;

    user.save(function(e){
      if(e){return next(e)}
      res.json(user);
    });
  })
});

router.put('/saveSettings/:id', function(req, res, next) {
  Users.findOne({_id:req.params.id},function(err, user){
    user['firstname'] = req.body.firstname;
    user['lastname'] = req.body.lastname;
    user['firstAddress'] = req.body.firstAddress;
    user['secondAddress'] = req.body.secondAddress;
    user['city'] = req.body.city;
    user['zip'] = req.body.zip;
    user['sizeOneID'] = req.body.sizeOneID;
    user['sizeTwoID'] = req.body.sizeTwoID;
    user['sizeThreeID'] = req.body.sizeThreeID;
    user['sizeOne'] = req.body.sizeOne;
    user['sizeTwo'] = req.body.sizeTwo;
    user['sizeThree'] = req.body.sizeThree;

    user['sizeOneID2'] = req.body.sizeOneID2;
    user['sizeTwoID2'] = req.body.sizeTwoID2;
    user['sizeThreeID2'] = req.body.sizeThreeID2;
    user['sizeOne2'] = req.body.sizeOne2;
    user['sizeTwo2'] = req.body.sizeTwo2;
    user['sizeThree2'] = req.body.sizeThree2;

    user['sizeOneID3'] = req.body.sizeOneID3;
    user['sizeTwoID3'] = req.body.sizeTwoID3;
    user['sizeThreeID3'] = req.body.sizeThreeID3;
    user['sizeOne3'] = req.body.sizeOne3;
    user['sizeTwo3'] = req.body.sizeTwo3;
    user['sizeThree3'] = req.body.sizeThree3;
    user['firstTime'] = 0;

    user.save(function(e){
      if(e){return next(e)}
      res.json(user);
    });
  })
});

router.put('/updateSettings/:id', function(req, res, next) {
  Users.findOne({_id:req.params.id},function(err, user){
    console.log(req.body);
    user['firstname'] = req.body.firstname;
    user['lastname'] = req.body.lastname;
    user['firstAddress'] = req.body.firstAddress;
    user['secondAddress'] = req.body.secondAddress;
    user['city'] = req.body.city;
    user['zip'] = req.body.zip;

    user['sizeOneID'] = req.body.sizeOneID;
    user['sizeTwoID'] = req.body.sizeTwoID;
    user['sizeThreeID'] = req.body.sizeThreeID;
    user['sizeOne'] = req.body.sizeOne;
    user['sizeTwo'] = req.body.sizeTwo;
    user['sizeThree'] = req.body.sizeThree;

    user['sizeOneID2'] = req.body.sizeOneID2;
    user['sizeTwoID2'] = req.body.sizeTwoID2;
    user['sizeThreeID2'] = req.body.sizeThreeID2;
    user['sizeOne2'] = req.body.sizeOne2;
    user['sizeTwo2'] = req.body.sizeTwo2;
    user['sizeThree2'] = req.body.sizeThree2;

    user['sizeOneID3'] = req.body.sizeOneID3;
    user['sizeTwoID3'] = req.body.sizeTwoID3;
    user['sizeThreeID3'] = req.body.sizeThreeID3;
    user['sizeOne3'] = req.body.sizeOne3;
    user['sizeTwo3'] = req.body.sizeTwo3;
    user['sizeThree3'] = req.body.sizeThree3;

    user['brand1'] = req.body.brand1;
    user['brand2'] = req.body.brand2;
    user['brand3'] = req.body.brand3;
    user['brand4'] = req.body.brand4;
    user['brand5'] = req.body.brand5;
    user['brand6'] = req.body.brand6;
    user['brand7'] = req.body.brand7;
    user['brand8'] = req.body.brand8;
    user['brand9'] = req.body.brand9;
    user['brand10'] = req.body.brand10;

    user.save(function(e){
      if(e){return next(e)}
      res.json(user);
    });
  })
});

router.get('/addAllBrands', function(req, res, next) {
  var allBrands = [];
  allBrands.push("& OTHER STORIES");
  allBrands.push("1 ET 1 FONT 3");
  allBrands.push("1 2 3");
  allBrands.push("10 CROSBY BY DL");
  allBrands.push("1789 CALA");
  allBrands.push("2CHILLIES");
  allBrands.push("3 SUISSES");
  allBrands.push("3.1 Phillip Lim");
  allBrands.push("7FOR ALL MANKIND");
  allBrands.push("80%20");
  // allBrands.push("ABERCROMBIE");
  allBrands.push("ADELINE CACHEUX");
  allBrands.push("ADIDAS");
  allBrands.push("AG JEANS");
  allBrands.push("AGATHA");
  allBrands.push("AGENT PROVOC");
  allBrands.push("AGNELLE");
  allBrands.push("AGNÈS B.");
  allBrands.push("AIGLE");
  allBrands.push("ALDO");
  allBrands.push("AM OUTFITTERS");
  allBrands.push("AM.PM");
  allBrands.push("AMERICAN APPAREL");
  allBrands.push("AMERICAN RETRO");
  allBrands.push("AMERICAN VINTAGE");
  allBrands.push("ANDRE");
  allBrands.push("ANN TAYLOR");
  allBrands.push("ANNA SUI");
  allBrands.push("ANNIEL");
  allBrands.push("ANTHOLOGY PARIS");
  allBrands.push("ANTHROPOLOGIE");
  allBrands.push("ANTIK BATIK");
  allBrands.push("APC");
  allBrands.push("APM MONACO");
  allBrands.push("APOLOGIE");
  allBrands.push("APRIL MAY");
  allBrands.push("ARIDZA BROSS");
  allBrands.push("ARMAND VENTILO");
  allBrands.push("ARMANI");
  allBrands.push("ARMOR LUX");
  allBrands.push("ASH");
  allBrands.push("ASICS");
  allBrands.push("ATELIER MERCADAL");
  allBrands.push("ATELIERDECAMILLE");
  allBrands.push("AVRIL GAU");
  allBrands.push("BALA BOOSTE");
  allBrands.push("BALLY");
  allBrands.push("BANANA MOON");
  allBrands.push("BANANA REPUBLIC");
  allBrands.push("BASH");
  allBrands.push("BCBG");
  allBrands.push("BENETTON");
  allBrands.push("BENSIMON");
  allBrands.push("BEST MOUNTAIN");
  allBrands.push("BILL TORNADE");
  allBrands.push("BIMBA Y LOLA");
  allBrands.push("BIRKENSTOCK");
  allBrands.push("BOBBIES");
  allBrands.push("BOCAGE");
  allBrands.push("BORSALINO");
  allBrands.push("BRIGITTE BARDOT");
  allBrands.push("BRUCE FIELD");
  allBrands.push("BUNGLE UP");
  allBrands.push("BURBERRY");
  allBrands.push("CACHAREL");
  allBrands.push("CALVIN KLEIN");
  allBrands.push("CAMAIEU");
  allBrands.push("CAMPER");
  allBrands.push("CARAVANE");
  allBrands.push("CAROL J");
  allBrands.push("CAROLL");
  allBrands.push("CARRE MONTAIGNE");
  allBrands.push("CARRE ROYAL");
  allBrands.push("CASTANER");
  allBrands.push("CHARMING CHARLIE");
  allBrands.push("CHEAP MONDAY");
  allBrands.push("CHEVIGNON");
  allBrands.push("CIMARRON");
  allBrands.push("CLAIRE'S");
  allBrands.push("CLARKS");
  allBrands.push("CLAUDIE PIERLOT");
  allBrands.push("CLIO BLUE");
  allBrands.push("CLUB MONACO");
  allBrands.push("COACH");
  allBrands.push("COLISEE DE SACHA")
  allBrands.push("COMMEDES GARCONS")
  allBrands.push("COP COPINE")
  allBrands.push("CORALIE DE SEYNES")
  allBrands.push("COSTUME NATIONAL")
  allBrands.push("COTÉLAC")
  allBrands.push("COTTON CITIZEN")
  allBrands.push("C-OUI")
  allBrands.push("CPT COTONNIERS")
  allBrands.push("CYNTHIA ROWLEY")
  allBrands.push("DE LA FRESSANGE")
  allBrands.push("DEAR CASHMERE")
  allBrands.push("DEAR CHARLOTTE")
  allBrands.push("DEBY DEBO")
  allBrands.push("DES PETITS HAUTS")
  allBrands.push("DIESEL")
  allBrands.push("DKNY")
  allBrands.push("DODO")
  allBrands.push("DONNI CHARM")
  allBrands.push("EASTPAK")
  allBrands.push("EILEEN FISHER")
  allBrands.push("ELEVEN PARIS")
  allBrands.push("ELIZABETH COLE")
  allBrands.push("ELLEN TRACY")
  allBrands.push("EQUIPMENT")
  allBrands.push("ERAM")
  allBrands.push("ERIC BOMPARD")
  allBrands.push("ESPRIT")
  allBrands.push("ESSENTIEL")
  allBrands.push("ET VOUS")
  allBrands.push("ETAM")
  allBrands.push("ETRO")
  allBrands.push("FACONNABLE")
  allBrands.push("FETE IMPERIALE")
  allBrands.push("FILLES A PAPA")
  allBrands.push("FOREVER21")
  allBrands.push("FOSSIL")
  allBrands.push("FOSSIL")
  allBrands.push("FREE LANCE")
  allBrands.push("FRENCH SOLE")
  allBrands.push("FRENCHCONNECTION")
  allBrands.push("FRYE")
  allBrands.push("FURLA");
  allBrands.push("GAL LAFAYETTE");
  allBrands.push("GAP");
  allBrands.push("GAS");
  allBrands.push("GEOX");
  allBrands.push("GERARD DAREL");
  allBrands.push("GLAMOROUS");
  allBrands.push("G-STAR");
  allBrands.push("GUESS");
  allBrands.push("H&M");
  allBrands.push("HARRODS");
  allBrands.push("HAVAIANAS");
  allBrands.push("HEIMSTONE");
  allBrands.push("HILLFIGER");
  allBrands.push("HIPANEMA");
  allBrands.push("HOALEN");
  allBrands.push("HOGAN");
  allBrands.push("HÔTELPARTICULIER");
  allBrands.push("HTC");
  allBrands.push("HUNTER BOOTS");
  allBrands.push("ICE WATCH");
  allBrands.push("IKKS");
  allBrands.push("INOUITOOSH");
  allBrands.push("IPANEMA");
  allBrands.push("IRIÉ");
  allBrands.push("ISABEL MARANT");
  allBrands.push("J.CREW");
  allBrands.push("JAEGER");
  allBrands.push("JAMIN PUECH");
  allBrands.push("JB MARTIN");
  allBrands.push("JODHPUR");
  allBrands.push("JOE RETRO");
  allBrands.push("JOIE");
  allBrands.push("JONAK");
  allBrands.push("JOSEPH");
  allBrands.push("JUICY COUTURES");
  allBrands.push("K JACQUES");
  allBrands.push("KAREN MILLEN");
  allBrands.push("KARINE ARABIAN");
  allBrands.push("KARL MARC JOHN");
  allBrands.push("KATE SPADE");
  allBrands.push("KENNETH COLE");
  allBrands.push("KENNETH COLE");
  allBrands.push("KENNETH JAY LANE");
  allBrands.push("KESSLORD");
  allBrands.push("KILIWATCH");
  allBrands.push("KIPLING");
  allBrands.push("K-WAY");
  allBrands.push("LA BAGAGERIE");
  allBrands.push("LA MOME BIJOU");
  allBrands.push("LA REDOUTE");
  allBrands.push("LACOSTE");
  allBrands.push("LAMARTHE");
  allBrands.push("LANCASTER");
  allBrands.push("LANDS END");
  allBrands.push("LE COQ SPORTIF");
  allBrands.push("LE TANNEUR");
  allBrands.push("LEE");
  allBrands.push("LEE COOPER");
  allBrands.push("LES NEREIDES");
  allBrands.push("LES PETITES");
  allBrands.push("LEVI'S");
  allBrands.push("LILI GAUFRETTE");
  allBrands.push("LISETTE MONTREAL");
  allBrands.push("LIU.JO");
  allBrands.push("LONGCHAMP");
  allBrands.push("LPB");
  allBrands.push("LTB");
  allBrands.push("LULU CASTAGNETTE");
  allBrands.push("MADAME A PARIS");
  allBrands.push("MAJ FILATURES");
  allBrands.push("MAJE");
  allBrands.push("MALO");
  allBrands.push("MALOLES");
  allBrands.push("MANGO");
  allBrands.push("MARC JACOBS");
  allBrands.push("MARIE SIXTINE");
  allBrands.push("MARION GODART");
  allBrands.push("MARKS & SPENCER");
  allBrands.push("MASSCOB");
  allBrands.push("MAX & CO");
  allBrands.push("MAX MARA");
  allBrands.push("MÉDECINE DOUCE");
  allBrands.push("MELLOW YELLOW");
  allBrands.push("MES DEMOISELLES");
  allBrands.push("MEXICANA");
  allBrands.push("MI PAC");
  allBrands.push("MICHAEL KORS");
  allBrands.push("MILA GARNET");
  allBrands.push("MILA LOUISE");
  allBrands.push("MINELLI");
  allBrands.push("MISS SIXTY");
  allBrands.push("MOA");
  allBrands.push("MODCLOTH");
  allBrands.push("MOLLY BRACKEN");
  allBrands.push("MONOPRIX");
  allBrands.push("MONT ST MICHEL");
  allBrands.push("MONTAGUT");
  allBrands.push("MOOD BY ME");
  allBrands.push("MORELLATO");
  allBrands.push("MORGAN");
  allBrands.push("MOSCHINO");
  allBrands.push("MYSUELLY");
  allBrands.push("NAF NAF");
  allBrands.push("NAT ET NIN");
  allBrands.push("NEW BALANCE");
  allBrands.push("NEW LOOK");
  allBrands.push("NEW MAN");
  allBrands.push("NIKE");
  allBrands.push("NINA RICCI");
  allBrands.push("NINE WEST");
  allBrands.push("NO NAME");
  allBrands.push("OPENING CEREMONY");
  allBrands.push("PABLO DE GDAREL");
  allBrands.push("PALLADIUM");
  allBrands.push("PAQUETAGE");
  allBrands.push("PARABOOT");
  allBrands.push("PASTELLE");
  allBrands.push("PATAGONIA");
  allBrands.push("PAUL & JOE");
  allBrands.push("PAUL & JOE SIS");
  allBrands.push("PAULE KA");
  allBrands.push("PEPE JEANS");
  allBrands.push("PETIT BATEAU");
  allBrands.push("PETITE MENDIGOTE");
  allBrands.push("POGGI");
  allBrands.push("POLDER");
  allBrands.push("POLO R LAUREN");
  allBrands.push("PRAIRIESDE PARIS");
  allBrands.push("PRETTY BALLERINA");
  allBrands.push("PRETTY LOAFERS");
  allBrands.push("PRIMARK");
  allBrands.push("PRINCESS TAM TAM");
  allBrands.push("PROMOD");
  allBrands.push("PUMA");
  allBrands.push("PURA LOPEZ");
  allBrands.push("RALPH LAUREN");
  allBrands.push("RAY-BAN");
  allBrands.push("REDSKINS");
  allBrands.push("REEBOOK");
  allBrands.push("REIKO");
  allBrands.push("REMINISCENCE");
  allBrands.push("RENE DEHRY");
  allBrands.push("REPETTO");
  allBrands.push("REPLAY");
  allBrands.push("RIVER ISLAND");
  allBrands.push("RIVIERAS");
  allBrands.push("ROBERT CLERGERIE");
  allBrands.push("ROSE & JOSEPHINE");
  allBrands.push("RUE BLANCHE");
  allBrands.push("SABRINA");
  allBrands.push("SAINT JAMES");
  allBrands.push("SAM EDELMAN");
  allBrands.push("SANDRO");
  allBrands.push("SATELLITE");
  allBrands.push("SEBAGO");
  allBrands.push("SEE BY CHLOE");
  allBrands.push("SEE U SOON");
  allBrands.push("SERAFINI");
  allBrands.push("SESSUN");
  allBrands.push("SHINE BLOSSOM");
  allBrands.push("SIGERSONMORRISON");
  allBrands.push("SILHOUETTE");
  allBrands.push("SINEQUANONE");
  allBrands.push("SISTER JANE");
  allBrands.push("SOREL");
  allBrands.push("SPANX");
  allBrands.push("SPORTMAX");
  allBrands.push("STALACTIC");
  allBrands.push("STELLA & DOT");
  allBrands.push("STELLA CADENTE");
  allBrands.push("STELLA FOREST");
  allBrands.push("STELLA MITTWAGEN");
  allBrands.push("STEPHANE KELIAN");
  allBrands.push("STETSON");
  allBrands.push("STEVE MADDEN");
  allBrands.push("SUD EXPRESS");
  allBrands.push("SUNCOO");
  allBrands.push("SUPERGA");
  allBrands.push("SWAROVSKI");
  allBrands.push("SWATCH");
  allBrands.push("SWILDENS");
  allBrands.push("T PAR ALEX WANG");
  allBrands.push("TARA JARMON");
  allBrands.push("TED LAPIDUS");
  allBrands.push("TEMPS DESCERISES");
  allBrands.push("THE KOOPLES");
  allBrands.push("THE NORTH FACE");
  allBrands.push("THIERRY MUGLER");
  allBrands.push("TILA MARCH");
  allBrands.push("TIMBERLAND");
  allBrands.push("TOD'S");
  allBrands.push("TOMMY HILFIGER");
  allBrands.push("TOMS");
  allBrands.push("TOPSHOP");
  allBrands.push("TORY BURCH");
  allBrands.push("UGG AUSTRALIA");
  allBrands.push("UNIQLO");
  allBrands.push("UPLA");
  allBrands.push("URBAN OUTFITTERS");
  allBrands.push("UTTAM BOUTIQUES");
  allBrands.push("VANESSA BRUNO");
  allBrands.push("VANS");
  allBrands.push("VEJA");
  allBrands.push("VERTIGO");
  allBrands.push("VICTORIA SECRET");
  allBrands.push("VINCE CAMUTO");
  allBrands.push("VIVIENNE TAM");
  allBrands.push("VUARNET");
  allBrands.push("WALTER STEIGER");
  allBrands.push("WE MAX MARA");
  allBrands.push("WELLICIOUS");
  allBrands.push("WRANGLER");
  allBrands.push("YOUNG FAB& BROKE");
  allBrands.push("ZADIG ET VOLTAIRE");
  allBrands.push("ZAPA");
  allBrands.push("ZARA");
  allBrands.push("ZOE TEE'S");
  allBrands.push('ASOS');
  allBrands.push('OLD NAVY');
  allBrands.push('DSQUARED2');

  for (var i = 0; i < allBrands.length; i++) {
    var oneBrand = {};
    if(
      allBrands[i] == 'ADIDAS' ||
      allBrands[i] == 'ALDO' ||
      allBrands[i] == 'BALLY' ||
      allBrands[i] == 'GAP' ||
      allBrands[i] == 'ZARA' ||
      allBrands[i] == 'J.CREW' ||
      allBrands[i] == 'ASOS' ||
      allBrands[i] == 'AMERICAN APPAREL' ||
      allBrands[i] == 'URBAN OUTFITTERS' ||
      allBrands[i] == 'ANN TAYLOR' ||
      allBrands[i] == 'NINE WEST' ||
      allBrands[i] == 'RALPH LAUREN' ||
      allBrands[i] == 'KATE SPADE' ||
      allBrands[i] == "LEVI'S" ||
      allBrands[i] == 'OLD NAVY' ||
      allBrands[i] == 'GUESS' ||
      allBrands[i] == 'DKNY' ||
      allBrands[i] == 'JUICY COUTURES' ||
      allBrands[i] == 'BANANA REPUBLIC' ||
      allBrands[i] == 'DIESEL' ||
      allBrands[i] == 'DSQUARED2' ||
      allBrands[i] == 'MAJE' ||
      allBrands[i] == 'TOPSHOP' ||
      allBrands[i] == 'MAX MARA' ||
      allBrands[i] == 'UNIQLO' ||
      allBrands[i] == 'ESPRIT' ||
      allBrands[i] == 'CLUB MONACO'
    ){
      oneBrand['favorite'] = 1;
    }
    oneBrand['name'] = allBrands[i];
    var dataItem = new Brands(oneBrand);
    dataItem.save(function(err, item){})
  }
  res.json(true);
});

module.exports = router;
