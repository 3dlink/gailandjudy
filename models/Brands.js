var mongoose = require('mongoose');

var BrandsSchema = new mongoose.Schema({
  name: String,
  favorite: {type: Number, default: 0}
});

mongoose.model('Brands',BrandsSchema);
