const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  filename: String,
  description: { type: String, default: "" },
  data: Buffer,
  contentType: String,
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Media", mediaSchema);
