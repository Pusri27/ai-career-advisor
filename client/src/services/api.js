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
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me')
};

// Profile
export const profileAPI = {
    get: () => api.get('/profile'),
    update: (data) => api.put('/profile', data),
    updateSkills: (skills) => api.post('/profile/skills', { skills }),
    updateGoals: (goals) => api.post('/profile/goals', { careerGoals: goals })
};

// AI Agents
export const agentAPI = {
    analyzeSkills: () => api.post('/agent/analyze-skills'),
    getCareerAdvice: (question = '') => api.post('/agent/career-advice', { question }),
    matchJobs: () => api.post('/agent/match-jobs'),
    getLearningPath: (skillGaps = []) => api.post('/agent/learning-path', { skillGaps }),
    fullAnalysis: () => api.post('/agent/full-analysis'),
    chat: (message, sessionId = null) => api.post('/agent/chat', { message, sessionId }),
    getChatSessions: () => api.get('/agent/chat/sessions'),
    getChatSession: (id) => api.get(`/agent/chat/sessions/${id}`)
};

// Jobs
export const jobsAPI = {
    search: (params) => api.get('/jobs/search', { params }),
    getDetails: (id) => api.get(`/jobs/${id}`),
    getSalary: (title, location) => api.get(`/jobs/salary/${title}`, { params: { location } })
};

export default api;
