// frontend/services/workExperienceService.js
import axiosInstance from "../utils/axiosInstance";

// Fixed: No duplicate /api prefix
const API_URL = "/work-experience";

const createRequest = (yearsOfService) =>
  axiosInstance.post(API_URL, { yearsOfService });

const getMyRequests = () =>
  axiosInstance.get(API_URL);

const getAdminRequests = () =>
  axiosInstance.get(`${API_URL}/admin`);

const approveRequest = (id) =>
  axiosInstance.put(`${API_URL}/approve/${id}`);

const rejectRequest = (id) =>
  axiosInstance.put(`${API_URL}/reject/${id}`);

const downloadLetter = (id) =>
  axiosInstance.get(`${API_URL}/download/${id}`, {
    responseType: "blob",
  });

const workExperienceService = {
  createRequest,
  getMyRequests,
  getAdminRequests,
  approveRequest,
  rejectRequest,
  downloadLetter,
};

export default workExperienceService;