import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, min: 0, max: 100, default: 50 }, // Proficiency percentage
    category: { type: String, enum: ['technical', 'soft', 'domain'], default: 'technical' }
});

const careerGoalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    targetDate: { type: Date },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' }
});

const careerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    currentRole: {
        type: String,
        default: ''
    },
    targetRole: {
        type: String,
        default: ''
    },
    yearsOfExperience: {
        type: Number,
        default: 0
    },
    industry: {
        type: String,
        default: ''
    },
    skills: [skillSchema],
    interests: [{
        type: String
    }],
    careerGoals: [careerGoalSchema],
    preferredWorkStyle: {
        type: String,
        enum: ['remote', 'hybrid', 'onsite', 'flexible'],
        default: 'flexible'
    },
    preferredLocation: {
        type: String,
        default: ''
    },
    salaryExpectation: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' }
    },
    careerScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    lastAnalysis: {
        type: Date
    },
    analysisHistory: [{
        date: { type: Date, default: Date.now },
        score: { type: Number },
        insights: { type: String }
    }]
}, { timestamps: true });

export default mongoose.model('CareerProfile', careerProfileSchema);
