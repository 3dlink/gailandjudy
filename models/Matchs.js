var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Item = mongoose.model('Items');
var Schema = mongoose.Schema;

var MatchsSchema = new mongoose.Schema({
  userA: {type: Schema.ObjectId, ref: "User"},
  userB: {type: Schema.ObjectId, ref: "User"},
  itemA1: {type: Schema.ObjectId, ref: "Item"},
  itemA2: {type:String, default: ""},
  itemA3: {type:String, default: ""},
  itemB1: {type: Schema.ObjectId, ref: "Item"},
  itemB2: {type:String, default: ""},
  itemB3: {type:String, default: ""},
  status1: {type: Number, default: 0},
  statusA: {type: Number, default: 0},
  statusB: {type: Number, default: 0},
  rematchA: {type: Number, default: 0},
  rematchB: {type: Number, default: 0},
});



// var MatchsSchema = new mongoose.Schema({
//   userA: {type: Schema.ObjectId, ref: "User"},
//   userB: {type: Schema.ObjectId, ref: "User"},
//   itemA1: {type: Schema.ObjectId, ref: "Item"},
//   itemA2: {type: Schema.ObjectId, ref: "Item"},
//   itemA3: {type: Schema.ObjectId, ref: "Item"},
//   itemB1: {type: Schema.ObjectId, ref: "Item"},
//   itemB2: {type: Schema.ObjectId, ref: "Item"},
//   itemB3: {type: Schema.ObjectId, ref: "Item"},
//   status1: {type: Number, default: 0},
//   statusA: {type: Number, default: 0},
//   statusB: {type: Number, default: 0},
//   rematchA: {type: Number, default: 0},
//   rematchB: {type: Number, default: 0},
// });


mongoose.model('Matchs',MatchsSchema);
//
//
// var MatchsSchema = new mongoose.Schema({
//   userA: {type: Schema.ObjectId, ref: "User"},
//   userB: {type: Schema.ObjectId, ref: "User"},
//   itemA1: {type: Schema.ObjectId, ref: "Item"},
//   itemA2: {type:String, default: ""},
//   itemA3: {type:String, default: ""},
//   itemB1: {type: Schema.ObjectId, ref: "Item"},
//   itemB2: {type:String, default: ""},
//   itemB3: {type:String, default: ""},
//   status1: {type: Number, default: 0},
//   statusA: {type: Number, default: 0},
//   statusB: {type: Number, default: 0},
//   rematchA: {type: Number, default: 0},
//   rematchB: {type: Number, default: 0},
//
// });
