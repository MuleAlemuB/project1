import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // backend base URL
  withCredentials: true, // if you use cookies/auth
});

export const getEmployees = () => api.get('/employees');
export const getVacancies = () => api.get('/vacancies');
export const getLeaveRequests = () => api.get('/leave-requests');
export const approveLeaveRequest = (id) => api.put(`/leave-requests/${id}/approve`);
export const rejectLeaveRequest = (id) => api.put(`/leave-requests/${id}/reject`);
export const getProfile = () => api.get('/employees/me');

// export default api if you want generic axios instance
export default api;
