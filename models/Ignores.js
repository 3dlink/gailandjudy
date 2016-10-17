var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Item = mongoose.model('Items');
var Schema = mongoose.Schema;


var IgnoresSchema = new mongoose.Schema({
  user: {type: Schema.ObjectId, ref: "User"},
  owner: {type: Schema.ObjectId, ref: "User"},
});

mongoose.model('Ignores',IgnoresSchema);
