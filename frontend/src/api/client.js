import axios from 'axios';


const API_URL = "https://health-tracker-tp6f.onrender.com/api";

export const registerUser = (username, email, password) => axios.post(`${API_URL}/register`, { username, email, password });
export const loginUser = (email, password) => axios.post(`${API_URL}/login`, { email, password });
export const saveUserProfile = (userId, profileData) => axios.post(`${API_URL}/profile`, { userId, profileData });
export const generateAIPlan = (userId) => axios.post(`${API_URL}/generate-plan`, { userId });
export const logUserProgress = (userId, logData) => axios.post(`${API_URL}/log-progress`, { userId, logData });
export const sendChatMessage = (userId, message) => axios.post(`${API_URL}/chat`, { userId, message });
export const getAdminData = (adminId) => axios.post(`${API_URL}/admin/dashboard`, { adminId });