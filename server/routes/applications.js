import express from 'express';
import { protect } from '../middleware/auth.js';
import JobApplication from '../models/JobApplication.js';

const router = express.Router();

// @route   GET /api/applications
// @desc    Get all applications
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status, sortBy = 'createdAt', order = 'desc' } = req.query;
        const query = { user: req.user._id };

        if (status) {
            query.status = status;
        }

        const sortOrder = order === 'asc' ? 1 : -1;
        const applications = await JobApplication.find(query)
            .sort({ [sortBy]: sortOrder });

        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/applications
// @desc    Create application
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const application = await JobApplication.create({
            user: req.user._id,
            ...req.body
        });

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const application = await JobApplication.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const application = await JobApplication.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        Object.assign(application, req.body);
        await application.save();

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/applications/:id
// @desc    Delete application
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const application = await JobApplication.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            message: 'Application deleted successfully'
        });
    } catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const application = await JobApplication.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        await application.updateStatus(status);

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/applications/:id/interviews
// @desc    Add interview
// @access  Private
router.post('/:id/interviews', protect, async (req, res) => {
    try {
        const application = await JobApplication.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        await application.addInterview(req.body);

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Add interview error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/applications/:id/reminders
// @desc    Add reminder
// @access  Private
router.post('/:id/reminders', protect, async (req, res) => {
    try {
        const application = await JobApplication.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        await application.addReminder(req.body);

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Add reminder error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/applications/stats
// @desc    Get application statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
    try {
        const stats = await JobApplication.getStats(req.user._id);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
