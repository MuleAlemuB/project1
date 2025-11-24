const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  employmentType: { type: String, required: true },
  qualification: { type: String },
  experience: { type: String },
  salary: { type: String },
  postDate: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  description: { type: String },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  isActive: { type: Boolean, default: true }
  
});

module.exports = mongoose.model("Vacancy", vacancySchema);
