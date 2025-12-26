import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
// Auth API
export const authAPI = {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
    getProfile: () => api.get('/api/auth/profile'),
    getMe: () => api.get('/api/auth/me'),
    updateProfile: (data) => api.put('/api/auth/profile', data)
};

// Profile API
export const profileAPI = {
    get: () => api.get('/api/profile'),
    update: (data) => api.put('/api/profile', data),
    updateSkills: (skills) => api.put('/api/profile/skills', { skills }),
    getSkillHistory: () => api.get('/api/profile/skill-history')
};

// Agent API
export const agentAPI = {
    analyzeSkills: (skills) => api.post('/api/agent/analyze-skills', { skills }),
    getCareerAdvice: (profile) => api.post('/api/agent/career-advice', { profile }),
    getJobRecommendations: (profile) => api.post('/api/agent/job-recommendations', { profile }),
    matchJobs: (profile) => api.post('/api/agent/job-recommendations', { profile }), // Alias
    getLearningPath: (skillGaps) => api.post('/api/agent/learning-path', { skillGaps }),
    getFullAnalysis: (profile) => api.post('/api/agent/full-analysis', { profile }),
    fullAnalysis: () => api.post('/api/agent/full-analysis'), // Alias for Dashboard
    chat: (message, context) => api.post('/api/agent/chat', { message, context })
};

// Progress API
export const progressAPI = {
    getGoals: () => api.get('/api/progress/goals'),
    createGoal: (data) => api.post('/api/progress/goals', data),
    updateGoal: (id, data) => api.put(`/api/progress/goals/${id}`, data),
    deleteGoal: (id) => api.delete(`/api/progress/goals/${id}`),
    getSkillHistory: (days) => api.get(`/api/progress/skill-history?days=${days}`)
};

// Applications API
export const applicationsAPI = {
    getAll: () => api.get('/api/applications'),
    create: (data) => api.post('/api/applications', data),
    update: (id, data) => api.put(`/api/applications/${id}`, data),
    delete: (id) => api.delete(`/api/applications/${id}`)
};

// Jobs API
export const jobsAPI = {
    search: (params) => api.get('/api/jobs/search', { params }),
    getDetails: (id) => api.get(`/api/jobs/${id}`)
};

export default api;
