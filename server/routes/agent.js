import express from 'express';
import { protect } from '../middleware/auth.js';
import CareerProfile from '../models/CareerProfile.js';
import ChatSession from '../models/ChatSession.js';
import orchestrator from '../services/agents/orchestrator.js';
import jobSearchService from '../services/jobSearch.js';

const router = express.Router();

// @route   POST /api/agent/analyze-skills
// @desc    Run skill gap analysis
// @access  Private
router.post('/analyze-skills', protect, async (req, res) => {
    try {
        const profile = await CareerProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Career profile not found. Please complete your profile first.'
            });
        }

        const result = await orchestrator.runSkillAnalysis(profile);

        // Update profile with new score if successful
        if (result.success && result.data?.overallScore) {
            await CareerProfile.findOneAndUpdate(
                { user: req.user._id },
                {
                    careerScore: result.data.overallScore,
                    lastAnalysis: new Date(),
                    $push: {
                        analysisHistory: {
                            score: result.data.overallScore,
                            insights: result.data.summary
                        }
                    }
                }
            );
        }

        res.json({
            success: result.success,
            data: result.data,
            error: result.error
        });
    } catch (error) {
        console.error('Skill Analysis Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/agent/career-advice
// @desc    Get career path recommendations
// @access  Private
router.post('/career-advice', protect, async (req, res) => {
    try {
        const { question } = req.body;
        const profile = await CareerProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Career profile not found'
            });
        }

        const result = await orchestrator.runCareerAdvice(profile, question);

        res.json({
            success: result.success,
            data: result.data,
            error: result.error
        });
    } catch (error) {
        console.error('Career Advice Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/agent/match-jobs
// @desc    Match jobs to profile
// @access  Private
router.post('/match-jobs', protect, async (req, res) => {
    try {
        const profile = await CareerProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Career profile not found'
            });
        }

        // Search for jobs based on target role
        const query = profile.targetRole || profile.currentRole || 'software developer';
        const jobs = await jobSearchService.searchJobs({
            query,
            location: profile.preferredLocation,
            remoteOnly: profile.preferredWorkStyle === 'remote'
        });

        // Get AI matching analysis
        const result = await orchestrator.runJobMatching(profile, jobs);

        res.json({
            success: result.success,
            jobs,
            analysis: result.data,
            error: result.error
        });
    } catch (error) {
        console.error('Job Matching Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/agent/job-recommendations
// @desc    Alias for match-jobs
// @access  Private
router.post('/job-recommendations', protect, async (req, res) => {
    try {
        const profile = await CareerProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Career profile not found'
            });
        }

        const query = profile.targetRole || profile.currentRole || 'software developer';
        const jobs = await jobSearchService.searchJobs({
            query,
            location: profile.preferredLocation,
            remoteOnly: profile.preferredWorkStyle === 'remote'
        });

        const result = await orchestrator.runJobMatching(profile, jobs);

        res.json({
            success: result.success,
            jobs,
            analysis: result.data,
            error: result.error
        });
    } catch (error) {
        console.error('Job Recommendations Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/agent/learning-path
// @desc    Get learning recommendations
// @access  Private
router.post('/learning-path', protect, async (req, res) => {
    try {
        const { skillGaps } = req.body;
        const profile = await CareerProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Career profile not found'
            });
        }

        const result = await orchestrator.runLearningRecommendation(profile, skillGaps || []);

        res.json({
            success: result.success,
            data: result.data,
            error: result.error
        });
    } catch (error) {
        console.error('Learning Path Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/agent/full-analysis
// @desc    Run comprehensive analysis with all agents
// @access  Private
router.post('/full-analysis', protect, async (req, res) => {
    try {
        const profile = await CareerProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Career profile not found'
            });
        }

        // Get jobs for matching
        const query = profile.targetRole || profile.currentRole || 'software developer';
        const jobs = await jobSearchService.searchJobs({ query });

        // Run all agents
        const result = await orchestrator.runFullAnalysis(profile, jobs);

        // Update career score
        if (result.skillAnalysis?.success && result.skillAnalysis?.data?.overallScore) {
            await CareerProfile.findOneAndUpdate(
                { user: req.user._id },
                {
                    careerScore: result.skillAnalysis.data.overallScore,
                    lastAnalysis: new Date()
                }
            );
        }

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Full Analysis Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/agent/chat
// @desc    General AI chat
// @access  Private
router.post('/chat', protect, async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        const profile = await CareerProfile.findOne({ user: req.user._id });

        // Get or create chat session
        let session;
        if (sessionId) {
            session = await ChatSession.findById(sessionId);
        }

        if (!session) {
            session = await ChatSession.create({
                user: req.user._id,
                title: message.substring(0, 50) + '...',
                messages: []
            });
        }

        // Add user message
        session.messages.push({
            role: 'user',
            content: message
        });

        // Get AI response
        const result = await orchestrator.chat(profile, session.messages);

        if (result.success) {
            // Add assistant response
            session.messages.push({
                role: 'assistant',
                content: result.response
            });
            await session.save();
        }

        res.json({
            success: result.success,
            sessionId: session._id,
            response: result.response,
            error: result.error
        });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/agent/chat/sessions
// @desc    Get user's chat sessions
// @access  Private
router.get('/chat/sessions', protect, async (req, res) => {
    try {
        const sessions = await ChatSession.find({ user: req.user._id })
            .select('title createdAt updatedAt')
            .sort({ updatedAt: -1 });

        res.json({
            success: true,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/agent/chat/sessions/:id
// @desc    Get chat session by ID
// @access  Private
router.get('/chat/sessions/:id', protect, async (req, res) => {
    try {
        const session = await ChatSession.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.json({
            success: true,
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
