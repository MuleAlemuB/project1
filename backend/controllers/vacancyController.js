import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

export const applyVacancy = async (req, res) => {
  const { name, email, phone, vacancyId, resume } = req.body;

  const application = await Application.create({
    name,
    email,
    phone,
    vacancy: vacancyId,
    resume,
  });

  // Create notification
  await Notification.create({
    type: "VacancyApplication",
    message: `New application from ${name} for vacancy ID: ${vacancyId}`,
    reference: application._id,
    typeRef: "Application",
  });

  res.status(201).json({ message: "Application submitted successfully", application });
};
