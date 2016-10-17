var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Brand = mongoose.model('Brands');

var Schema = mongoose.Schema;

var ItemsSchema = new mongoose.Schema({
  img1: String,
  img2: String,
  img3: String,
  title: String,
  description: String,
  pricesite: Number,
  priceyour: Number,
  brand: String,
  user: { type: Schema.ObjectId, ref: "User" },
  type: String,
  sizeID: Number,
  size: String,
  condition: String,
  material: String,
  color: String,
  likes: {type: Number, default: 0},
  loveActive: {type: Number, default: 1},
  skip: {type: Number, default: 0},
  active: {type: Number, default: 1}
});

mongoose.model('Items',ItemsSchema);
