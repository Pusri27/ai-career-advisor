// Format API error messages for user display
export const formatErrorMessage = (error) => {
    // Check if it's an Axios error
    if (error.response) {
        // Server responded with error status
        const { data, status } = error.response;

        // Handle specific status codes
        switch (status) {
            case 400:
                return data.message || 'Invalid request. Please check your input.';
            case 401:
                return 'Your session has expired. Please log in again.';
            case 403:
                return 'You don\'t have permission to perform this action.';
            case 404:
                return 'The requested resource was not found.';
            case 429:
                return 'Too many requests. Please slow down and try again later.';
            case 500:
                return 'Server error. Please try again later.';
            default:
                return data.message || 'An unexpected error occurred.';
        }
    } else if (error.request) {
        // Request was made but no response received
        return 'Network error. Please check your internet connection.';
    } else {
        // Something else happened
        return error.message || 'An unexpected error occurred.';
    }
};

// Extract validation errors from API response
export const extractValidationErrors = (error) => {
    if (error.response?.data?.errors) {
        return error.response.data.errors.reduce((acc, err) => {
            acc[err.field] = err.message;
            return acc;
        }, {});
    }
    return {};
};

// Check if error is a network error
export const isNetworkError = (error) => {
    return error.request && !error.response;
};

// Check if error is an authentication error
export const isAuthError = (error) => {
    return error.response?.status === 401;
};

// Check if error is a rate limit error
export const isRateLimitError = (error) => {
    return error.response?.status === 429;
};

// Retry helper for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await requestFn();
        } catch (error) {
            lastError = error;

            // Don't retry on client errors (4xx) except 429
            if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 429) {
                throw error;
            }

            // Wait before retrying
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }

    throw lastError;
};

// Log error to console with context
export const logError = (error, context = {}) => {
    console.error('Error occurred:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
        ...context,
        timestamp: new Date().toISOString()
    });
};
