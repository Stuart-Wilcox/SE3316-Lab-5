let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CollectionSchema = Schema({
  name: String,
  description: String,
  public: Boolean,
  user_id: String,
  rating: Number,
  image_id: [String],
  upvoters: [String]
});

module.exports = mongoose.model('Collection', CollectionSchema)
