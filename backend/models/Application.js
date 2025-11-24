const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  vacancy: { type: mongoose.Schema.Types.ObjectId, ref: "Vacancy", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resume: { type: String }, // filename
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", applicationSchema);
