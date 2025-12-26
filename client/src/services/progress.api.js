import api from './api';

// Progress & Analytics
export const progressAPI = {
    // Get skill history
    getSkillHistory: (params = {}) => {
        const { timeRange = '30', skill } = params;
        const queryParams = new URLSearchParams({ timeRange });
        if (skill) queryParams.append('skill', skill);
        return api.get(`/progress/skills?${queryParams}`);
    },

    // Get analytics summary
    getAnalytics: () => api.get('/progress/analytics'),

    // Goals
    getGoals: (status) => {
        const params = status ? `?status=${status}` : '';
        return api.get(`/progress/goals${params}`);
    },

    createGoal: (goalData) => api.post('/progress/goals', goalData),

    updateGoal: (id, goalData) => api.put(`/progress/goals/${id}`, goalData),

    deleteGoal: (id) => api.delete(`/progress/goals/${id}`),

    completeMilestone: (goalId, milestoneIndex) =>
        api.post(`/progress/goals/${goalId}/milestones/${milestoneIndex}`)
};

export default progressAPI;
