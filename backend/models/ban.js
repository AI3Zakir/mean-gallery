const mongoose = require('mongoose');

const BanSchema = mongoose.Schema({
  userId: { type: String, required: true },
  expiresIn: { type: Date, required: true }
});

module.exports = mongoose.model('Ban', BanSchema);
