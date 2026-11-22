import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mindbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const patientApi = {
  getDashboard: () => api.get('/patient/dashboard'),
  getProfile: () => api.get('/patient/profile'),
  updateProfile: (data: any) => api.put('/patient/profile', data),
};

export const doctorApi = {
  getDoctors: (specialization?: string) =>
    api.get('/doctors', { params: specialization ? { specialization } : {} }),
  getDoctorById: (id: string) => api.get(`/doctors/${id}`),
  getDoctorReviews: (id: string) => api.get(`/doctors/${id}/reviews`),
  getMyDoctorProfile: () => api.get('/doctor/profile'),
  updateMyDoctorProfile: (data: any) => api.put('/doctor/profile', data),
};

export const appointmentApi = {
  bookAppointment: (data: any) => api.post('/appointments/book', data),
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  getMyDoctorAppointments: () => api.get('/appointments/doctor/my-appointments'),
  getBookedSlots: (doctorId: string, date: string) =>
    api.get(`/appointments/doctor/${doctorId}/booked-slots`, { params: { date } }),
  updateAppointmentStatus: (id: string, status: string) =>
    api.put(`/appointments/${id}/status`, null, { params: { status } }),
  cancelAppointment: (id: string, reason: string) =>
    api.post(`/appointments/${id}/cancel`, { cancellationReason: reason }),
};

export const consultationApi = {
  getRecordByAppointment: (appointmentId: string) =>
    api.get(`/consultations/appointment/${appointmentId}`),
  createOrUpdateRecord: (data: any) => api.post('/consultations', data),
  acknowledgeConsultation: (appointmentId: string) =>
    api.post(`/consultations/${appointmentId}/acknowledge`),
  submitFeedback: (data: any) => api.post('/consultations/feedback', data),
};

export const assessmentApi = {
  getQuestions: () => api.get('/assessments/questions'),
  submitAssessment: (data: any) => api.post('/assessments/submit', data),
  getAssessmentById: (id: string) => api.get(`/assessments/${id}`),
  getMyAssessments: () => api.get('/assessments/my-history'),
};

export const moodApi = {
  logMood: (data: any) => api.post('/mood', data),
  getMoodHistory: (days?: number) => api.get('/mood/history', { params: { days } }),
  getMoodStats: () => api.get('/mood/stats'),
};

export const cbtApi = {
  getExercises: (category?: string) =>
    api.get('/cbt/exercises', { params: category ? { category } : {} }),
  getExerciseById: (id: string) => api.get(`/cbt/exercises/${id}`),
  getMyProgress: () => api.get('/cbt/my-progress'),
  submitProgress: (exerciseId: string, data: any) =>
    api.post(`/cbt/exercises/${exerciseId}/progress`, data),
};

export const chatbotApi = {
  getConversations: () => api.get('/chatbot/conversations'),
  getMessages: (conversationId: string) => api.get(`/chatbot/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, messageText: string) =>
    api.post(`/chatbot/conversations/${conversationId}/messages`, { messageText }),
  createNewConversation: (title?: string) =>
    api.post('/chatbot/conversations', { title: title || 'New Session' }),
};

export const notificationApi = {
  getMyNotifications: () => api.get('/notifications'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export const adminApi = {
  getSystemStats: () => api.get('/admin/stats'),
  getPendingDoctors: () => api.get('/admin/doctors/pending'),
  verifyDoctor: (doctorId: string) => api.post(`/admin/doctors/${doctorId}/verify`),
  getUsersList: () => api.get('/admin/users'),
};

export default api;
