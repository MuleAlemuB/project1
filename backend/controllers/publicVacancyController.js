import Vacancy from '../models/Vacancy.js';

export const getPublicVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find().sort({ postedDate: -1 });
    res.status(200).json(vacancies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vacancies.' });
  }
};

export const applyToVacancyPublic = async (req, res) => {
  try {
    const { vacancyId } = req.params;
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const resume = req.files?.resume?.[0]?.path || '';
    const photo = req.files?.photo?.[0]?.path || '';

    const vacancy = await Vacancy.findById(vacancyId);
    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found.' });
    }

    // Add public applicant
    vacancy.applicants.push({
      name,
      email,
      phone,
      resume,
      photo
    });

    await vacancy.save();

    res.status(200).json({ message: 'Application submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit application.' });
  }
};
