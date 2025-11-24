import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  file: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String } // e.g. HR Admin
});

export default mongoose.model('Announcement', announcementSchema);
