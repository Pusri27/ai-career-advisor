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
        return api.get(`/applications${query ? `?${query}` : ''}`);
    },

    // Get single application
    getById: (id) => api.get(`/applications/${id}`),

    // Create application
    create: (applicationData) => api.post('/applications', applicationData),

    // Update application
    update: (id, applicationData) => api.put(`/applications/${id}`, applicationData),

    // Delete application
    delete: (id) => api.delete(`/applications/${id}`),

    // Update status
    updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),

    // Add interview
    addInterview: (id, interviewData) => api.post(`/applications/${id}/interviews`, interviewData),

    // Add reminder
    addReminder: (id, reminderData) => api.post(`/applications/${id}/reminders`, reminderData),

    // Get statistics
    getStats: () => api.get('/applications/stats/summary')
};

export default applicationsAPI;
