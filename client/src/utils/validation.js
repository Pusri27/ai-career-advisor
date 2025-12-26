/**
 * Form Validation Utilities
 * Provides reusable validation functions for forms across the application
 */

export const validators = {
    required: (value) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return 'This field is required';
        }
        return null;
    },

    minLength: (min) => (value) => {
        if (value && value.length < min) {
            return `Minimum ${min} characters required`;
        }
        return null;
    },

    maxLength: (max) => (value) => {
        if (value && value.length > max) {
            return `Maximum ${max} characters allowed`;
        }
        return null;
    },

    range: (min, max) => (value) => {
        const num = Number(value);
        if (isNaN(num) || num < min || num > max) {
            return `Value must be between ${min} and ${max}`;
        }
        return null;
    },

    futureDate: (value) => {
        if (value && new Date(value) <= new Date()) {
            return 'Date must be in the future';
        }
        return null;
    },

    pastDate: (value) => {
        if (value && new Date(value) >= new Date()) {
            return 'Date must be in the past';
        }
        return null;
    },

    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
            return 'Invalid email format';
        }
        return null;
    },

    url: (value) => {
        try {
            if (value) new URL(value);
            return null;
        } catch {
            return 'Invalid URL format';
        }
    },

    phone: (value) => {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (value && !phoneRegex.test(value)) {
            return 'Invalid phone number';
        }
        return null;
    },

    number: (value) => {
        if (value && isNaN(Number(value))) {
            return 'Must be a valid number';
        }
        return null;
    },

    positiveNumber: (value) => {
        const num = Number(value);
        if (value && (isNaN(num) || num <= 0)) {
            return 'Must be a positive number';
        }
        return null;
    }
};

/**
 * Validate a value against multiple validation rules
 * @param {any} value - Value to validate
 * @param {Array} rules - Array of validation functions
 * @returns {string|null} - Error message or null if valid
 */
export const validate = (value, rules) => {
    for (const rule of rules) {
        const error = rule(value);
        if (error) return error;
    }
    return null;
};

/**
 * Validate an entire form object
 * @param {Object} formData - Form data object
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} - Object with errors for each field
 */
export const validateForm = (formData, validationRules) => {
    const errors = {};

    for (const [field, rules] of Object.entries(validationRules)) {
        const error = validate(formData[field], rules);
        if (error) {
            errors[field] = error;
        }
    }

    return errors;
};

/**
 * Check if form has any errors
 * @param {Object} errors - Errors object
 * @returns {boolean} - True if form is valid
 */
export const isFormValid = (errors) => {
    return !Object.values(errors).some(error => error);
};
