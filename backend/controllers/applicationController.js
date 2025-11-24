import Notification from "../models/Notification.js";
import Vacancy from "../models/Vacancy.js";
import Application from "../models/Application.js";

export const createApplication = async (req, res) => {
  try {
    const { name, email, phone, vacancyId } = req.body;
    const vacancy = await Vacancy.findById(vacancyId);
    if (!vacancy) return res.status(404).json({ message: "Vacancy not found" });

    const newApplication = await Application.create({ name, email, phone, vacancy: vacancyId });

    // create admin notification
    await Notification.create({
      type: "Vacancy Application",
      message: `${name} applied for "${vacancy.position}"`,
      seen: false,
      applicant: { name, email, phone },
      vacancy: { title: vacancy.position, department: vacancy.department },
      recipientRole: "Admin"
    });

    res.status(201).json({ message: "Application submitted", application: newApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const deleteApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Remove the application from the Vacancy's applications array
    if (application.vacancy) {
      await Vacancy.findByIdAndUpdate(application.vacancy, {
        $pull: { applications: application._id }
      });
    }

    // Delete the application
    await application.remove();

    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
