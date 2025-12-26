import express from 'express';
import { protect } from '../middleware/auth.js';
import jobSearchService from '../services/jobSearch.js';

const router = express.Router();

// @route   GET /api/jobs/search
// @desc    Search for jobs
// @access  Private
router.get('/search', protect, async (req, res) => {
    try {
        const { query, location, page = 1, remote } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter is required'
            });
        }

        const jobs = await jobSearchService.searchJobs({
            query,
            location,
            page: parseInt(page),
            remoteOnly: remote === 'true'
        });

        res.json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get job details
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const job = await jobSearchService.getJobDetails(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/jobs/salary/:title
// @desc    Get estimated salary for a job title
// @access  Private
router.get('/salary/:title', protect, async (req, res) => {
    try {
        const { location = 'United States' } = req.query;

        const salaryData = await jobSearchService.getEstimatedSalary({
            jobTitle: req.params.title,
            location
        });

        res.json({
            success: true,
            data: salaryData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
