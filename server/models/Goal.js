import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    targetSkill: {
        type: String,
        required: true,
        trim: true
    },
    targetLevel: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    startingLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    currentLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'abandoned'],
        default: 'active',
        index: true
    },
    milestones: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Date
        }
    }],
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Virtual for progress percentage
goalSchema.virtual('progress').get(function () {
    const totalNeeded = this.targetLevel - this.startingLevel;
    if (totalNeeded <= 0) return 100;

    const currentProgress = this.currentLevel - this.startingLevel;
    return Math.min(100, Math.max(0, Math.round((currentProgress / totalNeeded) * 100)));
});

// Virtual for milestone completion percentage
goalSchema.virtual('milestoneProgress').get(function () {
    if (this.milestones.length === 0) return 0;
    const completed = this.milestones.filter(m => m.completed).length;
    return Math.round((completed / this.milestones.length) * 100);
});

// Method to complete milestone
goalSchema.methods.completeMilestone = async function (milestoneIndex) {
    if (milestoneIndex >= 0 && milestoneIndex < this.milestones.length) {
        this.milestones[milestoneIndex].completed = true;
        this.milestones[milestoneIndex].completedAt = new Date();
        await this.save();
    }
};

// Method to check if goal should be completed
goalSchema.methods.checkCompletion = async function () {
    if (this.currentLevel >= this.targetLevel && this.status === 'active') {
        this.status = 'completed';
        this.completedAt = new Date();
        await this.save();
    }
};

// Ensure virtuals are included in JSON
goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

export default mongoose.model('Goal', goalSchema);
