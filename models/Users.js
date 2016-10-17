var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
  firstname: String,
  lastname: {type: String, default: ""},
  email: String,
  username: String,
  password: String,
  image: {type: String, default: ""},
  firstTime: {type: String, default: 1},
  firstAddress: {type: String, default: ""},
  secondAddress: {type: String, default: ""},
  city: {type: String, default: ""},
  zip: {type: String, default: ""},
  star: {type: Number, default: 0},

  sizeOneID: {type: Number, default: 0},
  sizeTwoID: {type: Number, default: 0},
  sizeThreeID: {type: Number, default: 0},
  sizeOne: {type: String, default: ""},
  sizeTwo: {type: String, default: ""},
  sizeThree: {type: String, default: ""},

  sizeOneID2: {type: Number, default: 0},
  sizeTwoID2: {type: Number, default: 0},
  sizeThreeID2: {type: Number, default: 0},
  sizeOne2: {type: String, default: ""},
  sizeTwo2: {type: String, default: ""},
  sizeThree2: {type: String, default: ""},

  sizeOneID3: {type: Number, default: 0},
  sizeTwoID3: {type: Number, default: 0},
  sizeThreeID3: {type: Number, default: 0},
  sizeOne3: {type: String, default: ""},
  sizeTwo3: {type: String, default: ""},
  sizeThree3: {type: String, default: ""},

  sales: {type: Number, default: 0},
  swaps: {type: Number, default: 0},
  brand1: {type: String, default: ""},
  brand2: {type: String, default: ""},
  brand3: {type: String, default: ""},
  brand4: {type: String, default: ""},
  brand5: {type: String, default: ""},
  brand6: {type: String, default: ""},
  brand7: {type: String, default: ""},
  brand8: {type: String, default: ""},
  brand9: {type: String, default: ""},
  brand10: {type: String, default: ""}
});

mongoose.model('Users',UsersSchema);
