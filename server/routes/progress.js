import express from 'express';
import { protect } from '../middleware/auth.js';
import SkillHistory from '../models/SkillHistory.js';
import Goal from '../models/Goal.js';
import CareerProfile from '../models/CareerProfile.js';

const router = express.Router();

// @route   GET /api/progress/skills
// @desc    Get skill history
// @access  Private
router.get('/skills', protect, async (req, res) => {
    try {
        const { timeRange = '30', skill } = req.query;
        const days = parseInt(timeRange);

        const history = await SkillHistory.getSkillHistory(
            req.user._id,
            skill || null,
            days
        );

        // Group by skill
        const groupedBySkill = history.reduce((acc, record) => {
            if (!acc[record.skill]) {
                acc[record.skill] = [];
            }
            acc[record.skill].push({
                level: record.level,
                date: record.recordedAt,
                source: record.source
            });
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                skills: Object.keys(groupedBySkill).map(skillName => ({
                    name: skillName,
                    history: groupedBySkill[skillName]
                }))
            }
        });
    } catch (error) {
        console.error('Get skill history error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/progress/analytics
// @desc    Get analytics summary
// @access  Private
router.get('/analytics', protect, async (req, res) => {
    try {
        const profile = await CareerProfile.findOne({ user: req.user._id });
        const history = await SkillHistory.getSkillHistory(req.user._id, null, 30);
        const goals = await Goal.find({ user: req.user._id, status: 'active' });

        // Calculate improvement rates
        const skillImprovements = {};
        history.forEach(record => {
            if (!skillImprovements[record.skill]) {
                skillImprovements[record.skill] = { first: record.level, last: record.level };
            }
            skillImprovements[record.skill].last = record.level;
        });

        const improvements = Object.entries(skillImprovements).map(([skill, data]) => ({
            skill,
            improvement: data.last - data.first
        })).sort((a, b) => b.improvement - a.improvement);

        const mostImproved = improvements[0] || null;
        const avgImprovement = improvements.length > 0
            ? improvements.reduce((sum, item) => sum + item.improvement, 0) / improvements.length
            : 0;

        // Goals completed this month
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const goalsCompletedThisMonth = await Goal.countDocuments({
            user: req.user._id,
            status: 'completed',
            completedAt: { $gte: monthStart }
        });

        res.json({
            success: true,
            data: {
                totalSkills: profile?.skills?.length || 0,
                avgImprovement: Math.round(avgImprovement * 10) / 10,
                mostImproved: mostImproved,
                goalsCompletedThisMonth,
                activeGoals: goals.length
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/progress/goals
// @desc    Create new goal
// @access  Private
router.post('/goals', protect, async (req, res) => {
    try {
        const goal = await Goal.create({
            user: req.user._id,
            ...req.body
        });

        res.status(201).json({
            success: true,
            data: goal
        });
    } catch (error) {
        console.error('Create goal error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/progress/goals
// @desc    Get all goals
// @access  Private
router.get('/goals', protect, async (req, res) => {
    try {
        const { status } = req.query;
        const query = { user: req.user._id };

        if (status) {
            query.status = status;
        }

        const goals = await Goal.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: goals
        });
    } catch (error) {
        console.error('Get goals error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/progress/goals/:id
// @desc    Update goal
// @access  Private
router.put('/goals/:id', protect, async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        Object.assign(goal, req.body);
        await goal.save();

        res.json({
            success: true,
            data: goal
        });
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/progress/goals/:id
// @desc    Delete goal
// @access  Private
router.delete('/goals/:id', protect, async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        res.json({
            success: true,
            message: 'Goal deleted successfully'
        });
    } catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/progress/goals/:id/milestones/:index
// @desc    Complete milestone
// @access  Private
router.post('/goals/:id/milestones/:index', protect, async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        await goal.completeMilestone(parseInt(req.params.index));

        res.json({
            success: true,
            data: goal
        });
    } catch (error) {
        console.error('Complete milestone error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
