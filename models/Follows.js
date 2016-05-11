var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Schema = mongoose.Schema;


var FollowsSchema = new mongoose.Schema({
  user: { type: Schema.ObjectId, ref: "User" },
  follow: {type: Schema.ObjectId, ref: "User"}
});

mongoose.model('Follows',FollowsSchema);
