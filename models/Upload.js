const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  branch: String,
  year: String,
  subject: String,
  description: String,
  file: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Upload', uploadSchema);
