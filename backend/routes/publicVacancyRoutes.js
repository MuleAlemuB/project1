import express from 'express';
import { getPublicVacancies, applyToVacancyPublic } from '../controllers/publicVacancyController.js';
import upload from '../middlewares/uploadPublicFiles.js';

const router = express.Router();

// Public route: List vacancies
router.get('/', getPublicVacancies);

// Public route: Apply to vacancy with file upload
router.post(
  '/:vacancyId/apply',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
  ]),
  applyToVacancyPublic
);

export default router;
