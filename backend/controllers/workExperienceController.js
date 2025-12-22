// backend/controllers/workExperienceController.js
import WorkExperienceRequest from "../models/WorkExperienceRequest.js";
import Notification from "../models/Notification.js";

// Employee or DeptHead submits a request
export const submitRequest = async (req, res) => {
  try {
    const { roleSubmitted, department, reason } = req.body;

    const data = {
      employee: req.user._id,
      roleSubmitted,
      department,
      reason,
    };

    // Handle optional file attachment
    if (req.file) {
      data.requestAttachment = req.file.path;
    }

    const request = await WorkExperienceRequest.create(data);

    // Create notification for Admin
    await Notification.create({
      type: "Work Experience Request",
      message: `Work Experience Request from ${req.user.firstname} ${req.user.lastname}`,
      sender: req.user._id,
      receiverRole: "Admin",
      link: `/admin/work-experience/${request._id}`,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit request" });
  }
};

// Admin: Get all requests with employee info
export const getAllRequests = async (req, res) => {
  try {
    const docs = await WorkExperienceRequest.find()
      .populate("employee", "firstname lastname email department") // <-- populate these fields
      .sort({ createdAt: -1 });

    res.status(200).json(docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

// Admin: Reject a request
export const rejectRequest = async (req, res) => {
  try {
    const { reason } = req.body;

    const request = await WorkExperienceRequest.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected", adminDecisionReason: reason },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reject request" });
  }
};

// Admin: Approve request with uploaded letter
export const approveWithUpload = async (req, res) => {
  try {
    const request = await WorkExperienceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "Approved";
    request.letterFile = req.file ? req.file.path : null;
    request.generatedLetterLink = null;

    await request.save();
    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve request" });
  }
};

// Admin: Approve request with generated letter link
export const approveWithGeneratedLetter = async (req, res) => {
  try {
    const { link } = req.body;

    const request = await WorkExperienceRequest.findByIdAndUpdate(
      req.params.id,
      { status: "Approved", generatedLetterLink: link, letterFile: null },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve request" });
  }
};
