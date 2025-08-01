const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['summary', 'quiz'], required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Summary', summarySchema);
