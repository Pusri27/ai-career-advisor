// Skill level color utilities
export const getSkillLevelColor = (level) => {
    if (level <= 25) return 'text-red-500';
    if (level <= 50) return 'text-yellow-500';
    if (level <= 75) return 'text-blue-500';
    return 'text-green-500';
};

export const getSkillLevelBadge = (level) => {
    if (level <= 25) return { text: 'Beginner', color: 'bg-red-500' };
    if (level <= 50) return { text: 'Intermediate', color: 'bg-yellow-500' };
    if (level <= 75) return { text: 'Advanced', color: 'bg-blue-500' };
    return { text: 'Expert', color: 'bg-green-500' };
};

// Goal deadline utilities
export const getDaysUntilDeadline = (deadline) => {
    const days = Math.ceil(
        (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return days;
};

export const getDeadlineStatus = (days) => {
    if (days < 0) return { text: 'Overdue', color: 'bg-red-500', urgent: true };
    if (days <= 7) return { text: `${days}d left`, color: 'bg-red-500', urgent: true };
    if (days <= 30) return { text: `${days}d left`, color: 'bg-yellow-500', urgent: false };
    return { text: `${days}d left`, color: 'bg-gray-500', urgent: false };
};

// Format date utilities
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatRelativeTime = (date) => {
    const days = getDaysUntilDeadline(date);
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days < 0) return `${Math.abs(days)} days ago`;
    return `in ${days} days`;
};
