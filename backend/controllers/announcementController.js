import asyncHandler from 'express-async-handler';
import Announcement from '../models/Announcement.js';

// Create a new announcement (with optional file)
export const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, content, createdBy } = req.body;
  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const file = req.file ? req.file.filename : null;

  const announcement = await Announcement.create({
    title,
    content,
    createdBy,
    file,
  });

  res.status(201).json(announcement);
});

// Get all announcements
export const getAllAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.json(announcements);
});

// Post announcement (alternative to create, sets date automatically)
export const postAnnouncement = asyncHandler(async (req, res) => {
  const { title, content, uploadedBy } = req.body;
  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const newAnnouncement = new Announcement({
    title,
    content,
    uploadedBy,
    date: new Date(),
  });

  await newAnnouncement.save();
  res.status(201).json({ message: 'Announcement posted successfully', announcement: newAnnouncement });
});
