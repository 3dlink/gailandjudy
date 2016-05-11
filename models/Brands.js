var mongoose = require('mongoose');

var BrandsSchema = new mongoose.Schema({
  name: String
});

mongoose.model('Brands',BrandsSchema);
