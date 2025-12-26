import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Calendar, X, Trash2, AlertTriangle, Plus, Download, RefreshCw } from 'lucide-react';
import showToast from '../utils/toast';
import { getDaysUntilDeadline, getDeadlineStatus } from '../utils/helpers';
import { validators, validate } from '../utils/validation';
import { exportProgressReport } from '../utils/exportPDF';
import { SkeletonGoal, SkeletonChart } from '../components/ui/Skeleton';
import { useRefresh } from '../context/RefreshContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import progressAPI from '../services/progress.api';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Progress() {
    const { profile } = useAuth();
    const [timeRange, setTimeRange] = useState('30');
    const [skillHistory, setSkillHistory] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [goalForm, setGoalForm] = useState({
        title: '',
        targetSkill: '',
        targetLevel: 80,
        deadline: '',
        milestones: []
    });
    const [formErrors, setFormErrors] = useState({});
    const [newMilestone, setNewMilestone] = useState('');
    const [autoSeeded, setAutoSeeded] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, goalId: null, goalTitle: '' });
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [timeRange]);

    // Auto-seed skill history on first load if empty
    useEffect(() => {
        const autoSeed = async () => {
            if (!autoSeeded && skillHistory.length === 0 && profile?.skills && profile.skills.length > 0 && !loading) {
                try {
                    await profileAPI.updateSkills(profile.skills);
                    setAutoSeeded(true);
                    // Refetch data after seeding
                    setTimeout(() => fetchData(), 500);
                } catch (error) {
                    console.error('Auto-seed failed:', error);
                }
            }
        };
        autoSeed();
    }, [skillHistory, profile, loading, autoSeeded]);

    // Auto-refresh when window gains focus (user returns to page)
    useEffect(() => {
        const handleFocus = () => {
            fetchData();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [historyRes, analyticsRes, goalsRes] = await Promise.all([
                progressAPI.getSkillHistory(parseInt(timeRange)),
                progressAPI.getAnalytics(),
                progressAPI.getGoals('active')
            ]);

            // API returns { success, data: { skills: [...] } }
            setSkillHistory(historyRes.data.data?.skills || []);
            setAnalytics(analyticsRes.data.data);
            setGoals(goalsRes.data.data || []);
        } catch (error) {
            console.error('Failed to fetch progress data:', error);
        } finally {
            setLoading(false);
        }
    };

    const seedSkillHistory = async () => {
        if (!profile?.skills || profile.skills.length === 0) {
            showToast.error('No skills found in your profile. Please add skills first in the Assessment page.');
            return;
        }

        try {
            // Update skills to trigger auto-tracking
            await profileAPI.updateSkills(profile.skills);
            showToast.success('Skill history seeded successfully!');
            fetchData();
        } catch (error) {
            console.error('Failed to seed skill history:', error);
            showToast.error('Failed to seed skill history');
        }
    };


    const validateGoalForm = () => {
        const errors = {};

        errors.title = validate(goalForm.title, [
            validators.required,
            validators.minLength(3),
            validators.maxLength(100)
        ]);

        errors.targetSkill = validate(goalForm.targetSkill, [
            validators.required
        ]);

        errors.targetLevel = validate(goalForm.targetLevel, [
            validators.required,
            validators.range(1, 100)
        ]);

        errors.deadline = validate(goalForm.deadline, [
            validators.required,
            validators.futureDate
        ]);

        // Remove null errors
        Object.keys(errors).forEach(key => {
            if (!errors[key]) delete errors[key];
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateGoal = async (e) => {
        e.preventDefault();

        if (!validateGoalForm()) {
            showToast.error('Please fix form errors');
            return;
        }

        try {
            const currentSkillLevel = profile?.skills?.find(s => s.name === goalForm.targetSkill)?.level || 0;
            await progressAPI.createGoal({
                ...goalForm,
                startingLevel: currentSkillLevel,
                currentLevel: currentSkillLevel
            });
            showToast.success('Goal created successfully!');
            triggerRefresh('goals');
            setShowGoalForm(false);
            setGoalForm({ title: '', targetSkill: '', targetLevel: 80, deadline: '', milestones: [] });
            setFormErrors({});
            setNewMilestone('');
            fetchData();
        } catch (error) {
            console.error('Failed to create goal:', error);
            showToast.error('Failed to create goal');
        }
    };

    const addMilestone = () => {
        if (newMilestone.trim()) {
            setGoalForm({
                ...goalForm,
                milestones: [...goalForm.milestones, { title: newMilestone, completed: false }]
            });
            setNewMilestone('');
        }
    };

    const removeMilestone = (index) => {
        setGoalForm({
            ...goalForm,
            milestones: goalForm.milestones.filter((_, i) => i !== index)
        });
    };

    const handleDeleteGoal = async (goal) => {
        setDeleteConfirm({ show: true, goalId: goal._id, goalTitle: goal.title });
    };

    const confirmDelete = async () => {
        try {
            await progressAPI.deleteGoal(deleteConfirm.goalId);
            triggerRefresh('goals');
            setDeleteConfirm({ show: false, goalId: null, goalTitle: '' });
            showToast.success('Goal deleted successfully');
            fetchData();
        } catch (error) {
            console.error('Failed to delete goal:', error);
            showToast.error('Failed to delete goal');
        }
    };


    // Prepare chart data - only show skills that exist in current profile
    const activeSkillNames = profile?.skills?.map(s => s.name) || [];
    const filteredSkillHistory = skillHistory.filter(skill => activeSkillNames.includes(skill.name));

    const chartData = filteredSkillHistory.length > 0
        ? filteredSkillHistory[0]?.history.map((point, index) => {
            const dataPoint = { date: format(new Date(point.date), 'MMM dd') };
            filteredSkillHistory.forEach(skill => {
                if (skill.history[index]) {
                    dataPoint[skill.name] = skill.history[index].level;
                }
            });
            return dataPoint;
        }) || []
        : [];

    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-bg-secondary)]">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex items-center justify-between"
                    >
                        <div>
                            <h1 className="heading-2 mb-2">Progress Tracking</h1>
                            <p className="body text-[var(--color-text-secondary)]">
                                Track your skill improvement and achieve your goals
                            </p>
                        </div>
                        <Button
                            onClick={async () => {
                                setIsExporting(true);
                                try {
                                    const result = await exportProgressReport({
                                        skills: profile?.skills || [],
                                        goals: goals,
                                        analytics: analytics
                                    });
                                    if (result.success) {
                                        showToast.success(`PDF exported: ${result.fileName}`);
                                    } else {
                                        showToast.error('Failed to export PDF');
                                    }
                                } catch (error) {
                                    showToast.error('Export failed');
                                } finally {
                                    setIsExporting(false);
                                }
                            }}
                            disabled={isExporting}
                            className="flex items-center gap-2"
                        >
                            {isExporting ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            {isExporting ? 'Exporting...' : 'Export PDF'}
                        </Button>
                    </motion.div>

                    {/* Analytics Cards */}
                    {analytics && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Total Skills</p>
                                                <p className="heading-3">{analytics.totalSkills}</p>
                                            </div>
                                            <TrendingUp className="w-8 h-8 text-[var(--color-accent)]" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Avg Improvement</p>
                                                <p className="heading-3">+{analytics.avgImprovement}</p>
                                            </div>
                                            <Award className="w-8 h-8 text-green-500" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Most Improved</p>
                                                <p className="body font-semibold">{analytics.mostImproved?.skill || 'N/A'}</p>
                                            </div>
                                            <Target className="w-8 h-8 text-blue-500" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Goals This Month</p>
                                                <p className="heading-3">{analytics.goalsCompletedThisMonth}</p>
                                            </div>
                                            <Calendar className="w-8 h-8 text-yellow-500" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    )}

                    {/* Skill Progress Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-8"
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Skill Progress</CardTitle>
                                        <CardDescription>Track your skill levels over time</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={fetchData}
                                            className="px-3 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg text-sm hover:bg-[var(--color-bg-secondary)] transition-colors"
                                            title="Refresh data"
                                        >
                                            🔄 Refresh
                                        </button>
                                        <select
                                            value={timeRange}
                                            onChange={(e) => setTimeRange(e.target.value)}
                                            className="px-3 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg text-sm"
                                        >
                                            <option value="7">Last 7 days</option>
                                            <option value="30">Last 30 days</option>
                                            <option value="90">Last 90 days</option>
                                        </select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="date" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" domain={[0, 100]} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'var(--color-bg-tertiary)',
                                                    border: '1px solid var(--color-border-primary)',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Legend />
                                            {filteredSkillHistory.map((skill, index) => (
                                                <Line
                                                    key={skill.name}
                                                    type="monotone"
                                                    dataKey={skill.name}
                                                    stroke={colors[index % colors.length]}
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                />
                                            ))}
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-64 flex flex-col items-center justify-center text-[var(--color-text-tertiary)]">
                                        <p className="mb-4">No skill history data yet. Update your skills to start tracking!</p>
                                        <Button onClick={seedSkillHistory} variant="secondary">
                                            Seed History from Current Skills
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Goals Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Active Goals</CardTitle>
                                        <CardDescription>Track progress toward your targets</CardDescription>
                                    </div>
                                    <Button onClick={() => setShowGoalForm(true)}>
                                        Create Goal
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="space-y-4">
                                        <SkeletonGoal />
                                        <SkeletonGoal />
                                        <SkeletonGoal />
                                    </div>
                                ) : goals.length > 0 ? (
                                    <div className="space-y-4">
                                        {goals.map((goal) => (
                                            <div
                                                key={goal._id}
                                                className="p-4 bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border-primary)]"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="body font-semibold mb-1">{goal.title}</h4>
                                                        <p className="body-small text-[var(--color-text-tertiary)]">
                                                            Target: {goal.targetSkill} - Level {goal.targetLevel}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="badge badge-primary">{goal.progress}%</span>
                                                        {(() => {
                                                            const daysLeft = getDaysUntilDeadline(goal.deadline);
                                                            const status = getDeadlineStatus(daysLeft);
                                                            return status.urgent && (
                                                                <span className={`px-2 py-1 rounded text-xs text-white ${status.color} flex items-center gap-1`}>
                                                                    <AlertTriangle className="w-3 h-3" />
                                                                    {status.text}
                                                                </span>
                                                            );
                                                        })()}
                                                        <button
                                                            onClick={() => handleDeleteGoal(goal)}
                                                            className="p-1 hover:bg-red-500/10 rounded text-red-500 hover:text-red-400"
                                                            title="Delete goal"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="w-full h-2 bg-[var(--color-bg-primary)] rounded-full overflow-hidden mb-3">
                                                    <div
                                                        className="h-full bg-[var(--color-accent)] rounded-full transition-all"
                                                        style={{ width: `${goal.progress}%` }}
                                                    />
                                                </div>
                                                {goal.milestones?.length > 0 && (
                                                    <div className="space-y-2">
                                                        {goal.milestones.map((milestone, index) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={milestone.completed}
                                                                    onChange={() => {
                                                                        progressAPI.completeMilestone(goal._id, index)
                                                                            .then(() => {
                                                                                showToast.success('Milestone completed!');
                                                                                fetchData();
                                                                            })
                                                                            .catch(() => showToast.error('Failed to complete milestone'));
                                                                    }}
                                                                    className="w-4 h-4"
                                                                />
                                                                <span className={`body-small ${milestone.completed ? 'line-through text-[var(--color-text-tertiary)]' : ''}`}>
                                                                    {milestone.title}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Target className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
                                        <p className="body text-[var(--color-text-secondary)] mb-4">
                                            No active goals yet
                                        </p>
                                        <Button onClick={() => setShowGoalForm(true)}>
                                            Create Your First Goal
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>

            {/* Goal Creation Modal */}
            {showGoalForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[var(--color-bg-primary)] rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="heading-3">Create New Goal</h3>
                            <button onClick={() => setShowGoalForm(false)} className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateGoal} className="space-y-4">
                            <div>
                                <label className="body-small font-medium mb-2 block">Goal Title</label>
                                <input
                                    type="text"
                                    required
                                    value={goalForm.title}
                                    onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                                    placeholder="e.g., Master React Development"
                                    className="w-full px-4 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="body-small font-medium mb-2 block">Target Skill</label>
                                <select
                                    required
                                    value={goalForm.targetSkill}
                                    onChange={(e) => setGoalForm({ ...goalForm, targetSkill: e.target.value })}
                                    className="w-full px-4 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg"
                                >
                                    <option value="">Select a skill</option>
                                    {profile?.skills?.map(skill => (
                                        <option key={skill.name} value={skill.name}>{skill.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="body-small font-medium mb-2 block">Target Level: {goalForm.targetLevel}</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={goalForm.targetLevel}
                                    onChange={(e) => setGoalForm({ ...goalForm, targetLevel: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="body-small font-medium mb-2 block">Deadline</label>
                                <input
                                    type="date"
                                    required
                                    value={goalForm.deadline}
                                    onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="body-small font-medium mb-2 block">Milestones (Optional)</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={newMilestone}
                                        onChange={(e) => setNewMilestone(e.target.value)}
                                        placeholder="Add a milestone"
                                        className="flex-1 px-4 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg"
                                    />
                                    <Button type="button" onClick={addMilestone} variant="secondary">Add</Button>
                                </div>
                                {goalForm.milestones.length > 0 && (
                                    <div className="space-y-2">
                                        {goalForm.milestones.map((milestone, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-[var(--color-bg-tertiary)] rounded">
                                                <span className="body-small">{milestone.title}</span>
                                                <button type="button" onClick={() => removeMilestone(index)} className="text-red-500 hover:text-red-400">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )
                                }
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" className="flex-1">Create Goal</Button>
                                <Button type="button" variant="secondary" onClick={() => setShowGoalForm(false)} className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[var(--color-bg-primary)] rounded-2xl p-6 max-w-md w-full border border-[var(--color-border-primary)]"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="heading-4 mb-2">Delete Goal?</h3>
                                <p className="body-small text-[var(--color-text-secondary)]">
                                    Are you sure you want to delete "<span className="font-semibold text-[var(--color-text-primary)]">{deleteConfirm.goalTitle}</span>"? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-500 hover:bg-red-600"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setDeleteConfirm({ show: false, goalId: null, goalTitle: '' })}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
}
