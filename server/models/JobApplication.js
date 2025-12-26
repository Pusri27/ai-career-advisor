import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    jobUrl: {
        type: String,
        trim: true
    },
    salary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    },
    status: {
        type: String,
        enum: ['saved', 'applied', 'interview', 'offer', 'rejected', 'accepted'],
        default: 'saved',
        index: true
    },
    appliedDate: {
        type: Date
    },
    source: {
        type: String,
        enum: ['linkedin', 'indeed', 'company_website', 'referral', 'other'],
        default: 'other'
    },

    // Interview tracking
    interviews: [{
        type: {
            type: String,
            enum: ['phone', 'technical', 'behavioral', 'final', 'other'],
            required: true
        },
        scheduledAt: {
            type: Date,
            required: true
        },
        completedAt: Date,
        notes: String,
        feedback: String
    }],

    // Reminders
    reminders: [{
        type: {
            type: String,
            enum: ['follow_up', 'interview_prep', 'custom'],
            required: true
        },
        dueDate: {
            type: Date,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],

    // Notes and contacts
    notes: {
        type: String,
        maxlength: 2000
    },
    contacts: [{
        name: String,
        role: String,
        email: String,
        phone: String
    }],

    // Offer details
    offer: {
        salary: Number,
        bonus: Number,
        equity: String,
        benefits: String,
        startDate: Date,
        deadline: Date
    }
}, {
    timestamps: true
});

// Index for efficient queries
jobApplicationSchema.index({ user: 1, status: 1 });
jobApplicationSchema.index({ user: 1, createdAt: -1 });

// Virtual for days since applied
jobApplicationSchema.virtual('daysSinceApplied').get(function () {
    if (!this.appliedDate) return null;
    const diff = Date.now() - this.appliedDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Method to update status
jobApplicationSchema.methods.updateStatus = async function (newStatus) {
    this.status = newStatus;

    // Set appliedDate when status changes to 'applied'
    if (newStatus === 'applied' && !this.appliedDate) {
        this.appliedDate = new Date();
    }

    await this.save();
};

// Method to add interview
jobApplicationSchema.methods.addInterview = async function (interviewData) {
    this.interviews.push(interviewData);

    // Auto-update status to interview if not already
    if (this.status === 'applied' || this.status === 'saved') {
        this.status = 'interview';
    }

    await this.save();
};

// Method to add reminder
jobApplicationSchema.methods.addReminder = async function (reminderData) {
    this.reminders.push(reminderData);
    await this.save();
};

// Static method to get statistics
jobApplicationSchema.statics.getStats = async function (userId) {
    const applications = await this.find({ user: userId });

    const stats = {
        total: applications.length,
        byStatus: {
            saved: 0,
            applied: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
            accepted: 0
        },
        responseRate: 0,
        avgTimeToInterview: 0
    };

    applications.forEach(app => {
        stats.byStatus[app.status]++;
    });

    // Calculate response rate (interview + offer + accepted) / applied
    const applied = stats.byStatus.applied + stats.byStatus.interview + stats.byStatus.offer + stats.byStatus.rejected + stats.byStatus.accepted;
    const responded = stats.byStatus.interview + stats.byStatus.offer + stats.byStatus.accepted;
    stats.responseRate = applied > 0 ? Math.round((responded / applied) * 100) : 0;

    // Calculate average time to interview
    const interviewApps = applications.filter(app =>
        app.interviews.length > 0 && app.appliedDate
    );

    if (interviewApps.length > 0) {
        const totalDays = interviewApps.reduce((sum, app) => {
            const firstInterview = app.interviews.sort((a, b) => a.scheduledAt - b.scheduledAt)[0];
            const days = Math.floor((firstInterview.scheduledAt - app.appliedDate) / (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0);
        stats.avgTimeToInterview = Math.round(totalDays / interviewApps.length);
    }

    return stats;
};

// Ensure virtuals are included in JSON
jobApplicationSchema.set('toJSON', { virtuals: true });
jobApplicationSchema.set('toObject', { virtuals: true });

export default mongoose.model('JobApplication', jobApplicationSchema);
