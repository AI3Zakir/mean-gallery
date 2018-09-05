const mongoose = require('mongoose');

const AlbumSchema = mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: String, required: true },
  parentId: { type: String }
});

module.exports = mongoose.model('Album', AlbumSchema);
