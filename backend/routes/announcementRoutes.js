import express from 'express';
import {
  postAnnouncement,
  getAllAnnouncements,
} from '../controllers/announcementController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorizeRoles('HR'), postAnnouncement);
router.get('/', getAllAnnouncements);

export default router;
