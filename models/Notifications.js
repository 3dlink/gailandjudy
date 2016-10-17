var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Item = mongoose.model('Items');

var Schema = mongoose.Schema;


var NotificationsSchema = new mongoose.Schema({
  user: { type: Schema.ObjectId, ref: "User" },
  member: { type: Schema.ObjectId, ref: "User" },
  action: String,
  size: Number,
  icon: { type: String, default: ""},
  item: { type: Schema.ObjectId, ref: "Item" },
  news: { type: Number, default: 0},
  view: { type: Number, default: 0},

});


mongoose.model('Notifications',NotificationsSchema);
