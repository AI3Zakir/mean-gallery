const mongoose = require('mongoose');

const PhotoSchema = mongoose.Schema({
  title: { type: String, required: true },
  path: { type: String, required: true },
  userId: { type: String, required: true },
  parentId: { type: String }
});

module.exports = mongoose.model('Photo', PhotoSchema);
