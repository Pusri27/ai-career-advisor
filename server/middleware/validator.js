import { body, validationResult } from 'express-validator';

// Middleware to check validation results
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Auth validation rules
export const registerValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    validate
];

export const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    validate
];

// Profile validation rules
export const updateProfileValidation = [
    body('currentRole')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Current role must not exceed 100 characters'),

    body('targetRole')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Target role must not exceed 100 characters'),

    body('experience')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('Experience must be between 0 and 50 years'),

    body('education')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Education must not exceed 200 characters'),

    validate
];

export const updateSkillsValidation = [
    body('skills')
        .isArray({ min: 1 })
        .withMessage('Skills must be an array with at least one skill'),

    body('skills.*.name')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Skill name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z0-9\s\-\+\#\.]+$/)
        .withMessage('Skill name contains invalid characters'),

    body('skills.*.level')
        .isInt({ min: 0, max: 100 })
        .withMessage('Skill level must be between 0 and 100'),

    body('skills.*.category')
        .isIn(['technical', 'soft', 'language', 'other'])
        .withMessage('Invalid skill category'),

    validate
];

// Agent validation rules
export const chatValidation = [
    body('message')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Message must be between 1 and 1000 characters')
        .escape(), // Prevent XSS

    body('sessionId')
        .optional()
        .isMongoId()
        .withMessage('Invalid session ID'),

    validate
];

export const careerAdviceValidation = [
    body('question')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Question must not exceed 500 characters')
        .escape(),

    validate
];
