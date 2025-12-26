import mongoose from 'mongoose';

const skillHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    skill: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    source: {
        type: String,
        enum: ['manual', 'assessment', 'ai_analysis'],
        default: 'manual'
    },
    recordedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
skillHistorySchema.index({ user: 1, skill: 1, recordedAt: -1 });

// Static method to record skill change
skillHistorySchema.statics.recordSkillChange = async function (userId, skill, level, source = 'manual') {
    return await this.create({
        user: userId,
        skill,
        level,
        source,
        recordedAt: new Date()
    });
};

// Static method to get skill history
skillHistorySchema.statics.getSkillHistory = async function (userId, skillName = null, days = 30) {
    const query = {
        user: userId,
        recordedAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
    };

    if (skillName) {
        query.skill = skillName;
    }

    return await this.find(query).sort({ recordedAt: 1 });
};

export default mongoose.model('SkillHistory', skillHistorySchema);
