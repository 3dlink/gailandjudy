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
var Follows = mongoose.model('Follows');
var Matchs = mongoose.model('Matchs');
var Closedeals = mongoose.model('Closedeals');
var Notifications = mongoose.model('Notifications');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/txt', function(req, res, next){
  Closedeals.update({_id:"5731c63b517236a7029896b9"}, {type:1},function(e,g){
    res.json(true);
  });
})

router.post('/saveClosedeals',function(req, res, next){
  var dataNtf = new Closedeals(req.body);
  dataNtf.save(function(err, noti){
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
    if(err){return next(err)}
    if(users.length > 0){
      res.json(false);
    }
    else{
      newUser.save(function(err, user){
        returnUser['user'] = user;
        returnUser['follower'] = 0;
        returnUser['following'] = 0;
        res.json(returnUser);
      })
    }
  })
});

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

router.post('/likeItem', function(req,res,next){
  var dataLike = new Likes(req.body);

  Likes.findOne({$and:[ {user : dataLike['user']}, {item : dataLike['item']} ]},function(err, like){
    if(like){
      Likes.remove({$and:[ {user : dataLike['user']}, {item : dataLike['item']} ]}, function(er, like){
        Items.findOne( {$and:[{_id: dataLike['item']},{active:1}]},function(e, item){
          item['likes'] = item['likes'] - 1;
          item.save(function(e){
            res.json(item['likes']);
          });
        })
      })
    }
    else{
      dataLike.save(function(err, like){
        Items.findOne({$and:[{_id: dataLike['item']},{active:1}]},function(e, item){
          item['likes'] = item['likes'] + 1;
          item.save(function(e){
            var notifications = new Notifications({
              user: dataLike['user'],
              member: item['user'],
              action: "likes your",
              size: 30,
              icon: "assets/lovinmeRed.png",
              item: item['_id']
            })
            notifications.save(function(e){
              res.json(item['likes']);
            });
          });
        })
      })
    }
  })
})

router.post('/forgot', function(req, res, next) {
  console.log(req.body);
  res.json(true)
  // var smtpConfig = {
  //     host: 'sc2.conectarhosting.com',
  //     port: 465,
  //     secure: true, // use SSL
  //     auth: {
  //         user: 'cesar@cahl.com.ve',
  //         pass: '7819920'
  //     }
  // };
  //
  // var transporter = nodemailer.createTransport(smtpConfig);
  //
  // // create reusable transporter object using the default SMTP transport
  // // var transporter = nodemailer.createTransport('smtps://cesar@cahl.com.ve:7819920');
  //
  // // setup e-mail data with unicode symbols
  // var mailOptions = {
  //     from: '"Fred Foo 👥" <Cesarherguetal@gmail.com>', // sender address
  //     to: 'Cesarherguetal@gmail.com', // list of receivers
  //     subject: 'Gail & Judy', // Subject line
  //     html: '<b>Hello world 🐴</b>' // html body
  // };
  //
  // // send mail with defined transport object
  // transporter.sendMail(mailOptions, function(error, info){
  //     if(error){
  //         return console.log(error);
  //     }
  //     console.log('Message sent: ' + info.response);
  // });
});

router.get('/sendEmail', function(req,res,next){
  // { Name: 'Hh', Username: 'vv', Message: 'Hvh' }
  // console.log(req.body);
  var text = "WELCOME TO GAIL AND JUDY BITCH";
  var smtpConfig = {
      host: 'sc2.conectarhosting.com',
      port: 465,
      secure: true, // use SSL
      auth: {
          user: 'cesar@cahl.com.ve',
          pass: '7819920'
      }
  };

  var transporter = nodemailer.createTransport(smtpConfig);

  var mailOptions = {
      from: '"Tu papi 👥" <Cesarherguetal@gmail.com>', // sender address
      to: 'dbrito_9_9@hotmail.com', // list of receivers
      subject: 'Gail & Judy', // Subject line
      html: '<body style="width: 100%;max-width: 600px;margin: 0 auto;font-family: arial;">'+
      	'<header style="width: 100%;height: 85px;background-image: url(http://3dlinkweb.com/wp-content/uploads/2016/05/Header.png);background-repeat: no-repeat;"></header>'+
      	'<section style="float: left;width: 100%;padding: 50px;background: white;">'+
        text+
        '</section>'+
      	'<footer style="float: left;width: 100%;height: 320px;background-image: url(http://3dlinkweb.com/wp-content/uploads/2016/05/footer.png);background-repeat: no-repeat;padding: 50px 0;">'+
      		'<table style="text-align: center;vertical-align: middle; width:250px; margin:0 auto; color:#ae1721;border-spacing: 10px;">'+
      			'<tr>'+
      				'<td colspan="2">Download the app today</td>'+
      			'</tr>'+
      			'<tr>'+
      				'<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src="http://3dlinkweb.com/wp-content/uploads/2016/05/Applestore.png"></td>'+
      				'<td style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com"><img src="http://3dlinkweb.com/wp-content/uploads/2016/05/Googleplay.png"></td>'+
      			'</tr>'+
      			'<tr>'+
      				'<td colspan="2">Follow us on social media</td>'+
      			'</tr>'+
      			'<tr>'+
      				'<td colspan="2">'+
      					'<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src="http://3dlinkweb.com/wp-content/uploads/2016/05/Facebook.png">'+
      					'<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src="http://3dlinkweb.com/wp-content/uploads/2016/05/Twitter.png">'+
      					'<img style="cursor:pointer;" onclick="window.location.href=http://www.bepurpledash.com" src="http://3dlinkweb.com/wp-content/uploads/2016/05/Google.png">'+
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

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
  res.json(true)

})

router.post('/sendUsEmail', function(req,res,next){
  // { Name: 'Hh', Username: 'vv', Message: 'Hvh' }
    console.log(req.body);
    res.json(true)

    // var smtpConfig = {
    //     host: 'sc2.conectarhosting.com',
    //     port: 465,
    //     secure: true, // use SSL
    //     auth: {
    //         user: 'cesar@cahl.com.ve',
    //         pass: '7819920'
    //     }
    // };
    //
    // var transporter = nodemailer.createTransport(smtpConfig);
    //
    // // create reusable transporter object using the default SMTP transport
    // // var transporter = nodemailer.createTransport('smtps://cesar@cahl.com.ve:7819920');
    //
    // // setup e-mail data with unicode symbols
    // var mailOptions = {
    //     from: '"Fred Foo 👥" <Cesarherguetal@gmail.com>', // sender address
    //     to: 'Cesarherguetal@gmail.com', // list of receivers
    //     subject: 'Gail & Judy', // Subject line
    //     html: '<b>Hello world 🐴</b>' // html body
    // };
    //
    // // send mail with defined transport object
    // transporter.sendMail(mailOptions, function(error, info){
    //     if(error){
    //         return console.log(error);
    //     }
    //     console.log('Message sent: ' + info.response);
    // });
})

router.post('/uploadImg', function(req,res,next){
  var form = new multiparty.Form({autoFiles:true, uploadDir:'uploads/'});

  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }
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

router.post('/saveMatch', function(req, res, next){
  var saveMatch = new Matchs(req.body);
  console.log(saveMatch);
  saveMatch.save(function(err, f){
    if(err){return next(err)}
    res.json(true);
  })
})

router.post('/search', function(req, res, next){
  Items.find({$and:[{brand:req.body.brand},{type:req.body.type},{size:req.body.size}]}, function(err, items){
    res.json(items);
  })
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
  Matchs.find({ $and:[{$or:[{userA:req.params.id},{userB:req.params.id}]},{status1:0}]},function(err, matchs){
    matchSaved['matchs'] = matchs;
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
    Items.find({  $and:[{_id:{$in:items}},{active:0}]},function(err, allItems){
      for (var i = 0; i < allItems.length; i++) {
        itemReor[allItems[i]['_id']] = allItems[i];
      }
      matchSaved['items'] = itemReor;
      res.json(matchSaved);
    })
  })
})

router.get('/getBrandsWellcome',function(req,res,next){
  Brands.find({},function(err, brands){
    if(err){return next(err)}
    res.json(brands);
  }).limit(27)
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
            res.json(items);
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


  Items.find({$and:[{user : req.params.id},{ active:1}]},function(err, item){
    for (var i = 0; i < item.length; i++) {
      ItemIndex[item[i]['_id']] = item[i];
      It.push(item[i]['_id']);
    }
    Lovinme['Item'] = ItemIndex;
    Likes.find({item: {$in:It}}, function(e,like){
      for (var i = 0; i < like.length; i++) {
        Us.push(like[i]['user']);
      }
      Lovinme['Like'] = like;
      Users.find({_id: {$in:Us}}, function(er,user){
        for (var i = 0; i < user.length; i++) {
          UserIndex[user[i]['_id']] = user[i];
        }
        Lovinme['User'] = UserIndex;
        res.json(Lovinme);
      })
    })
  })
});

router.get('/detailsItem/:id/:user', function(req,res,next){
  var details = {};
  Items.findOne( {$and:[{_id: req.params.id},{active:1}]},function(err, item){
    details['item'] = item;
    Users.findOne({_id: item.user},function(err, user){
      details['user'] = user;
      Likes.findOne({$and:[ {user : req.params.user}, {item : req.params.id} ]},function(err, like){
        if(like){
          details['like'] = true;
        }
        else{
          details['like'] = false;
        }
        res.json(details);
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
    for (var i = 0; i < following.length; i++) {
      ing.push(following[i]['follow']);
    }
    Users.find( { _id : { $in : ing } },function(e, userFollowing){
      dt['Following'] = userFollowing;
      Follows.find({follow:req.params.id},function(err, followers){
        for (var i = 0; i < followers.length; i++) {
          er.push(followers[i]['user']);
        }
        Users.find( { _id : { $in : er } },function(e, userFollowers){
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
      Users.findOne({_id:match['userA']}, function(er, user1){
        user1['swaps'] = user1['swaps'] + 1;
        user1.saver(function(e){
          Users.findOne({_id:match['userB']}, function(er, user2){
            user2['swaps'] = user2['swaps'] + 1;
            user2.saver(function(e){
              Items.update({_id:{$in:items}},{active: 0}, function(e, it){
                match.save(function(e){
                  var notifications = new Notifications({
                    user: u,
                    member: m,
                    action: "approved the match with your",
                    size: 30,
                    icon: "assets/acceptMatch.png",
                    item: im
                  })
                  notifications.save(function(e){
                    res.json(true);
                  });
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
        var notifications = new Notifications({
          user: u,
          member: m,
          action: "added an item yo you match with your",
          size: 30,
          icon: "assets/addedItemRed.png",
          item: im
        })
        notifications.save(function(e){
          res.json(true);
        });
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
      var notifications = new Notifications({
        user: u,
        member: m,
        action: "declined the swap with your",
        size: 30,
        icon: "assets/declinedMatch.png",
        item: im
      })
      notifications.save(function(e){
        res.json(true);
      });
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
  allBrands.push("APC");
  allBrands.push("& OTHER STORIES");
  allBrands.push("1 ET 1 FONT 3");
  allBrands.push("1789 CALA");
  allBrands.push("3 SUISSES");
  allBrands.push("7 FOR ALL MANKIND");
  allBrands.push("ABERCROMBIE & FITCH");
  allBrands.push("ADIDAS");
  allBrands.push("AG JEANS");
  allBrands.push("AGATHA");
  allBrands.push("AGENT PROVOCATEUR");
  allBrands.push("AGNELLE");
  allBrands.push("AGNÈS B.");
  allBrands.push("AIGLE");
  allBrands.push("ALDO");
  allBrands.push("AM.PM");
  allBrands.push("AMERICAN APPAREL");
  allBrands.push("AMERICAN OUTFITTERS");
  allBrands.push("AMERICAN RETRO");
  allBrands.push("AMERICAN VINTAGE");
  allBrands.push("ANDRE");
  allBrands.push("ANN TAYLOR");
  allBrands.push("ANNA SUI");
  allBrands.push("ANNIEL");
  allBrands.push("ANTHOLOGY Paris");
  allBrands.push("ANTHROPOLOGIE");
  allBrands.push("ANTIK BATIK");
  allBrands.push("APM MONACO ");
  allBrands.push("APOLOGIE");
  allBrands.push("APRIL MAY");
  allBrands.push("ARIDZA BROSS");
  allBrands.push("ARMAND VENTILO");
  allBrands.push("ARMANI");
  allBrands.push("ARMOR LUX");
  allBrands.push("ASH");
  allBrands.push("ASICS");
  allBrands.push("ATELIER MERCADAL");
  allBrands.push("ATHE VANESSA BRUNO");
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
  allBrands.push("COLISEE DE SACHA");
  allBrands.push("COMME DES GARCONS");
  allBrands.push("COMPTOIR DES COTONNIERS");
  allBrands.push("COP COPINE");
  allBrands.push("CORALIE DE SEYNES");
  allBrands.push("COSTUME NATIONAL");
  allBrands.push("COTÉLAC");
  allBrands.push("C-OUI");
  allBrands.push("CYNTHIA ROWLEY");
  allBrands.push("DEAR CASHMERE");
  allBrands.push("DEAR CHARLOTTE");
  allBrands.push("DEBY DEBO");
  allBrands.push("DES PETITS HAUTS");
  allBrands.push("DIESEL");
  allBrands.push("DKNY");
  allBrands.push("DODO");
  allBrands.push("EASTPAK");
  allBrands.push("EILEEN FISHER");
  allBrands.push("ELEVEN PARIS");
  allBrands.push("ELIZABETH COLE ");
  allBrands.push("ELLEN TRACY");
  allBrands.push("EQUIPMENT");
  allBrands.push("ERAM");
  allBrands.push("ERIC BOMPARD");
  allBrands.push("ESPRIT");
  allBrands.push("ESSENTIEL");
  allBrands.push("ET VOUS");
  allBrands.push("ETAM");
  allBrands.push("ETRO");
  allBrands.push("FACONNABLE");
  allBrands.push("FILLES A PAPA");
  allBrands.push("FOREVER21");
  allBrands.push("FOSSIL");
  allBrands.push("FREE LANCE");
  allBrands.push("FRENCH CONNECTION");
  allBrands.push("FRENCH SOLE");
  allBrands.push("FURLA");
  allBrands.push("GALERIES LAFAYETTE");
  allBrands.push("GAP");
  allBrands.push("GAS");
  allBrands.push("GEOX")
  allBrands.push("GERARD DAREL")
  allBrands.push("GLAMOROUS")
  allBrands.push("G-STAR")
  allBrands.push("GUESS")
  allBrands.push("H&M")
  allBrands.push("HARRODS")
  allBrands.push("HAVAIANAS")
  allBrands.push("HEIMSTONE")
  allBrands.push("HILLFIGER COLLECTION")
  allBrands.push("HIPANEMA")
  allBrands.push("HOALEN")
  allBrands.push("HOGAN")
  allBrands.push("HÔTEL PARTICULIER")
  allBrands.push("HTC")
  allBrands.push("ICE WATCH")
  allBrands.push("IKKS")
  allBrands.push("INES DE LA FRESSANGE")
  allBrands.push("INOUITOOSH")
  allBrands.push("IPANEMA")
  allBrands.push("IRIÉ")
  allBrands.push("ISABEL MARANT")
  allBrands.push("J.CREW")
  allBrands.push("JAEGER")
  allBrands.push("JAMIN PUECH")
  allBrands.push("JB MARTIN")
  allBrands.push("JODHPUR")
  allBrands.push("JOE RETRO")
  allBrands.push("JOIE");
  allBrands.push("JONAK");
  allBrands.push("JOSEPH");
  allBrands.push("JUICY COUTURES");
  allBrands.push("K JACQUES");
  allBrands.push("KAREN MILLEN");
  allBrands.push("KARINE ARABIAN");
  allBrands.push("KATE SPADE");
  allBrands.push("KENNETH COLE");
  allBrands.push("KESSLORD");
  allBrands.push("KILIWATCH");
  allBrands.push("KIPLING");
  allBrands.push("K-WAY");
  allBrands.push("LA BAGAGERIE");
  allBrands.push("LA CHEMISERIE CACHAREL");
  allBrands.push("LA MOME BIJOU");
  allBrands.push("LA REDOUTE");
  allBrands.push("LACOSTE");
  allBrands.push("LAMARTHE");
  allBrands.push("LANCASTER");
  allBrands.push("L'ATELIER DE CAMILLE ");
  allBrands.push("LE COQ SPORTIF");
  allBrands.push("LE MONT SAINT MICHEL");
  allBrands.push("LE TANNEUR");
  allBrands.push("LE TEMPS DES CERISES");
  allBrands.push("LEE");
  allBrands.push("LEE COOPER");
  allBrands.push("LES NEREIDES");
  allBrands.push("LES PETITES");
  allBrands.push("LES PRAIRIES DE PARIS");
  allBrands.push("LEVI'S");
  allBrands.push("LILI GAUFRETTE");
  allBrands.push("LIU.JO");
  allBrands.push("LONGCHAMP");
  allBrands.push("LPB LES PETITES BOMBES");
  allBrands.push("LTB");
  allBrands.push("LULU CASTAGNETTE");
  allBrands.push("MADAME A PARIS");
  allBrands.push("MAJE");
  allBrands.push("MAJESTIC FILATURES");
  allBrands.push("MALO");
  allBrands.push("MALOLES");
  allBrands.push("MANGO");
  allBrands.push("MARC JACOBS");
  allBrands.push("MARIE SIXTINE");
  allBrands.push("MARION GODART");
  allBrands.push("MARKS & SPENCER");
  allBrands.push("MAX & CO");
  allBrands.push("MAX MARA");
  allBrands.push("MÉDECINE DOUCE");
  allBrands.push("MELLOW YELLOW");
  allBrands.push("MES DEMOISELLES");
  allBrands.push("MI PAC");
  allBrands.push("MICHAEL MICHAEL KORS");
  allBrands.push("MILA GARNET");
  allBrands.push("MILA LOUISE");
  allBrands.push("MINELLI");
  allBrands.push("MISS SIXTY");
  allBrands.push("MOA");
  allBrands.push("MODCLOTH");
  allBrands.push("MOLLY BRACKEN");
  allBrands.push("MONOPRIX");
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
  allBrands.push("PABLO DE GERARD DAREL");
  allBrands.push("PALLADIUM");
  allBrands.push("PAQUETAGE");
  allBrands.push("PARABOOT");
  allBrands.push("PASTELLE");
  allBrands.push("PATAGONIA");
  allBrands.push("PAUL & JOE");
  allBrands.push("PAUL & JOE SISTER");
  allBrands.push("PAULE KA");
  allBrands.push("PEPE JEANS");
  allBrands.push("PETIT BATEAU");
  allBrands.push("PETITE MENDIGOTE");
  allBrands.push("POGGI");
  allBrands.push("POLO RALPH LAUREN");
  allBrands.push("PRETTY BALLERINAS");
  allBrands.push("PRETTY LOAFERS");
  allBrands.push("PRINCESSE TAM TAM");
  allBrands.push("PROMOD");
  allBrands.push("PUMA");
  allBrands.push("PURA LOPEZ");
  allBrands.push("RALPH LAUREN");
  allBrands.push("RAY-BAN");
  allBrands.push("REDSKINS");
  allBrands.push("REEBOOK");
  allBrands.push("REMINISCENCE");
  allBrands.push("RENE DEHRY");
  allBrands.push("REPETTO");
  allBrands.push("REPLAY");
  allBrands.push("RIVER ISLAND");
  allBrands.push("RIVIERAS");
  allBrands.push("ROBERT CLERGERIE");
  allBrands.push("ROSE ET JOSEPHINE");
  allBrands.push("RUE BLANCHE");
  allBrands.push("SABRINA");
  allBrands.push("SAINT JAMES");
  allBrands.push("SANDRO");
  allBrands.push("SATELLITE");
  allBrands.push("SEBAGO");
  allBrands.push("SEE BY CHLOE");
  allBrands.push("SEE U SOON");
  allBrands.push("SERAFINI");
  allBrands.push("SESSUN");
  allBrands.push("SHINE BLOSSOM");
  allBrands.push("SIGERSON MORRISON");
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
  allBrands.push("T PAR ALEXANDER WANG");
  allBrands.push("TARA JARMON");
  allBrands.push("TED LAPIDUS");
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
  allBrands.push("UN 1 DEUX 2 TROIS 3");
  allBrands.push("UNIQLO");
  allBrands.push("UPLA");
  allBrands.push("URBAN OUTFITTERS");
  allBrands.push("UTTAM BOUTIQUES");
  allBrands.push("VANESSA BRUNO");
  allBrands.push("VANESSA BRUNO ATHE");
  allBrands.push("VANS");
  allBrands.push("VEJA");
  allBrands.push("VERTIGO");
  allBrands.push("VICTORIA'S SECRET");
  allBrands.push("VIVIENNE TAM");
  allBrands.push("VUARNET");
  allBrands.push("WALTER STEIGER");
  allBrands.push("WEEK END MAX MARA");
  allBrands.push("WELLICIOUS");
  allBrands.push("WRANGLER");
  allBrands.push("YOUNG FABULOUS AND BROKE");
  allBrands.push("ZADIG ET VOLTAIRE");
  allBrands.push("ZAPA");
  allBrands.push("ZARA");
  allBrands.push("ZOE TEE'S");

  for (var i = 0; i < allBrands.length; i++) {
    var oneBrand = {};
    oneBrand['name'] = allBrands[i];
    var dataItem = new Brands(oneBrand);
    // dataItem.save(function(err, item){})
  }
});

module.exports = router;
