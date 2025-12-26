import express from 'express';
import CareerProfile from '../models/CareerProfile.js';
import SkillHistory from '../models/SkillHistory.js';
import Goal from '../models/Goal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/profile
// @desc    Get user's career profile
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let profile = await CareerProfile.findOne({ user: req.user._id });

        // Create profile if doesn't exist
        if (!profile) {
            profile = await CareerProfile.create({ user: req.user._id });
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/profile
// @desc    Update career profile
// @access  Private
router.put('/', protect, async (req, res) => {
    try {
        const {
            currentRole,
            targetRole,
            yearsOfExperience,
            industry,
            interests,
            preferredWorkStyle,
            preferredLocation,
            salaryExpectation
        } = req.body;

        const profile = await CareerProfile.findOneAndUpdate(
            { user: req.user._id },
            {
                currentRole,
                targetRole,
                yearsOfExperience,
                industry,
                interests,
                preferredWorkStyle,
                preferredLocation,
                salaryExpectation
            },
            { new: true, runValidators: true, upsert: true }
        );

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/profile/skills
// @desc    Add or update skills
// @access  Private
router.post('/skills', protect, async (req, res) => {
    try {
        const { skills } = req.body; // Array of { name, level, category }

        const profile = await CareerProfile.findOneAndUpdate(
            { user: req.user._id },
            { skills },
            { new: true, runValidators: true }
        );

        // Auto-track skill changes in SkillHistory
        for (const skill of skills) {
            await SkillHistory.recordSkillChange(
                req.user._id,
                skill.name,
                skill.level,
                'manual'
            );
        }

        // Update goals with current skill levels
        const goals = await Goal.find({
            user: req.user._id,
            status: 'active'
        });

        for (const goal of goals) {
            const matchingSkill = skills.find(s => s.name === goal.targetSkill);
            if (matchingSkill) {
                goal.currentLevel = matchingSkill.level;
                await goal.save(); // Save the currentLevel update
                await goal.checkCompletion(); // Then check if it should be completed
            }
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/profile/skills
// @desc    Update skills (same as POST)
// @access  Private
router.put('/skills', protect, async (req, res) => {
    try {
        const { skills } = req.body;

        const profile = await CareerProfile.findOneAndUpdate(
            { user: req.user._id },
            { skills },
            { new: true, runValidators: true }
        );

        // Auto-track skill changes
        for (const skill of skills) {
            await SkillHistory.recordSkillChange(
                req.user._id,
                skill.name,
                skill.level,
                'manual'
            );
        }

        // Update goals
        const goals = await Goal.find({
            user: req.user._id,
            status: 'active'
        });

        for (const goal of goals) {
            const matchingSkill = skills.find(s => s.name === goal.targetSkill);
            if (matchingSkill) {
                goal.currentLevel = matchingSkill.level;
                await goal.save();
                await goal.checkCompletion();
            }
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/profile/goals
// @desc    Add or update career goals
// @access  Private
router.post('/goals', protect, async (req, res) => {
    try {
        const { careerGoals } = req.body;

        const profile = await CareerProfile.findOneAndUpdate(
            { user: req.user._id },
            { careerGoals },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
