var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Item = mongoose.model('Items');

var Schema = mongoose.Schema;


var ClosedealsSchema = new mongoose.Schema({
  user: { type: Schema.ObjectId, ref: "User" },
  member: { type: Schema.ObjectId, ref: "User" },
  action: String,
  size: Number,
  icon: { type: String, default: "assets/jacket.png"},
  img: { type: Schema.ObjectId, ref: "Item" },
  name: String,
  type: Number

});

mongoose.model('Closedeals',ClosedealsSchema);
