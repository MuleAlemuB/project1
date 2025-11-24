import mongoose from 'mongoose';

const jobApplicationSchema = mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  vacancyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy', required: true },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  resume: { type: String }, // optional, path to uploaded resume
}, { timestamps: true });

export default mongoose.model('JobApplication', jobApplicationSchema);
