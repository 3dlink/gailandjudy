var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Item = mongoose.model('Items');
var Schema = mongoose.Schema;


var LikesSchema = new mongoose.Schema({
  user: {type: Schema.ObjectId, ref: "User"},
  item: {type: Schema.ObjectId, ref: "Item"},
  owner: {type: Schema.ObjectId, ref: "User"},
});


mongoose.model('Likes',LikesSchema);
