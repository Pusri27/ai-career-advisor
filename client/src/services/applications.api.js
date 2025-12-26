import api from './api';

export const applicationsAPI = {
    // Get all applications
    getAll: (params = {}) => {
        const { status, sortBy, order } = params;
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (order) queryParams.append('order', order);

        const query = queryParams.toString();
        return api.get(`/api/applications${query ? `?${query}` : ''}`);
    },
    getById: (id) => api.get(`/api/applications/${id}`),
    create: (applicationData) => api.post('/api/applications', applicationData),
    update: (id, applicationData) => api.put(`/api/applications/${id}`, applicationData),
    delete: (id) => api.delete(`/api/applications/${id}`),

    // Update status
    updateStatus: (id, status) => api.put(`/api/applications/${id}/status`, { status }),

    // Add interview
    addInterview: (id, interviewData) => api.post(`/api/applications/${id}/interviews`, interviewData),

    // Add reminder
    addReminder: (id, reminderData) => api.post(`/api/applications/${id}/reminders`, reminderData),

    // Get statistics
    getStats: () => api.get('/api/applications/stats/summary')
};

export default applicationsAPI;
