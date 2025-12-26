import api from './api';

// Progress & Analytics
export const progressAPI = {
    // Goals
    getGoals: (status = 'active') => api.get(`/api/progress/goals`, { params: { status } }),
    createGoal: (data) => api.post('/api/progress/goals', data),
    updateGoal: (id, data) => api.put(`/api/progress/goals/${id}`, data),
    deleteGoal: (id) => api.delete(`/api/progress/goals/${id}`),
    updateMilestone: (goalId, milestoneId, completed) =>
        api.put(`/api/progress/goals/${goalId}/milestones/${milestoneId}`, { completed }),

    // Skill History - Fixed parameter format
    getSkillHistory: (days = 30) => api.get(`/api/progress/skill-history?days=${days}`),

    // Analytics
    getAnalytics: () => api.get('/api/progress/analytics')
};

export default progressAPI;
