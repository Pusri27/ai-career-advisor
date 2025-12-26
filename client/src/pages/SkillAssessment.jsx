import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    X,
    Save,
    Sparkles,
    ChevronRight,
    CheckCircle,
    Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAgent } from '../hooks/useAgent';
import { useRefresh } from '../context/RefreshContext';
import { getSkillLevelColor, getSkillLevelBadge } from '../utils/helpers';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import { profileAPI } from '../services/api';

const skillCategories = [
    { value: 'technical', label: 'Technical' },
    { value: 'soft', label: 'Soft Skills' },
    { value: 'domain', label: 'Domain Knowledge' }
];

const workStyles = [
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onsite', label: 'On-site' },
    { value: 'flexible', label: 'Flexible' }
];

const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS',
    'Project Management', 'Communication', 'Leadership', 'Problem Solving',
    'Data Analysis', 'Machine Learning', 'DevOps', 'Agile', 'UX Design'
];

export default function SkillAssessment() {
    const { profile, updateProfile, refreshProfile } = useAuth();
    const { triggerRefresh } = useRefresh();
    const { analyzeSkills, loading } = useAgent();

    const [formData, setFormData] = useState({
        currentRole: profile?.currentRole || '',
        targetRole: profile?.targetRole || '',
        yearsOfExperience: profile?.yearsOfExperience || 0,
        industry: profile?.industry || '',
        preferredWorkStyle: profile?.preferredWorkStyle || 'flexible'
    });

    const [skills, setSkills] = useState(profile?.skills || []);
    const [newSkill, setNewSkill] = useState({ name: '', level: 50, category: 'technical' });
    const [analysis, setAnalysis] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const addSkill = async () => {
        if (!newSkill.name.trim()) return;
        if (skills.find(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) return;

        // Capture current newSkill values before resetting
        const skillToAdd = {
            name: newSkill.name,
            level: newSkill.level,
            category: newSkill.category
        };

        const updatedSkills = [...skills, skillToAdd];
        setSkills(updatedSkills);
        setNewSkill({ name: '', level: 50, category: 'technical' });

        // Auto-save to backend
        try {
            await profileAPI.updateSkills(updatedSkills);
            // Trigger refresh for other pages
            triggerRefresh('skills');
            triggerRefresh('goals');
            triggerRefresh('profile');
        } catch (error) {
            console.error('Failed to add skill:', error);
        }
    };

    const removeSkill = async (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);

        // Auto-save to backend
        try {
            await profileAPI.updateSkills(updatedSkills);
        } catch (error) {
            console.error('Failed to remove skill:', error);
            // Revert on error
            setSkills(skills);
        }
    };

    const addQuickSkill = async (skillName) => {
        if (skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) return;

        // Use current proficiency level from form, not hardcoded 50
        const updatedSkills = [...skills, {
            name: skillName,
            level: newSkill.level,
            category: 'technical'
        }];
        setSkills(updatedSkills);

        // Auto-save to backend
        try {
            await profileAPI.updateSkills(updatedSkills);
            // Trigger refresh for other pages
            triggerRefresh('skills');
            triggerRefresh('goals');
            triggerRefresh('profile');
        } catch (error) {
            console.error('Failed to add quick skill:', error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await updateProfile(formData);
            await profileAPI.updateSkills(skills);
            await refreshProfile();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAnalyze = async () => {
        await handleSave();
        setAnalyzing(true);
        try {
            const result = await analyzeSkills();
            setAnalysis(result);
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-bg-secondary)]">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="heading-2 mb-2">Skill Assessment</h1>
                        <p className="body text-[var(--color-text-secondary)]">
                            Complete your profile to unlock personalized AI insights
                        </p>
                    </motion.div>

                    <div className="space-y-6">
                        {/* Career Profile Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Career Profile</CardTitle>
                                    <CardDescription>Tell us about your current situation</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Current Role"
                                            placeholder="e.g., Software Developer"
                                            value={formData.currentRole}
                                            onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                                        />
                                        <Input
                                            label="Target Role"
                                            placeholder="e.g., Senior Software Engineer"
                                            value={formData.targetRole}
                                            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <Input
                                            label="Experience (Years)"
                                            type="number"
                                            min="0"
                                            value={formData.yearsOfExperience}
                                            onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                                        />
                                        <Input
                                            label="Industry"
                                            placeholder="e.g., Tech"
                                            value={formData.industry}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        />
                                        <Select
                                            label="Work Style"
                                            options={workStyles}
                                            value={formData.preferredWorkStyle}
                                            onChange={(e) => setFormData({ ...formData, preferredWorkStyle: e.target.value })}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Skills Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Skills</CardTitle>
                                    <CardDescription>Rate your proficiency in key areas</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Add Skill Form */}
                                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                                        <div className="flex-1 w-full">
                                            <Input
                                                label="Add Skill"
                                                placeholder="e.g. React"
                                                value={newSkill.name}
                                                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                                className="mb-0"
                                            />
                                        </div>
                                        <div className="w-full sm:w-auto">
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                                                Proficiency: {newSkill.level}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={newSkill.level}
                                                onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                                                className="w-full h-10 accent-[var(--color-accent)]"
                                            />
                                        </div>
                                        <div className="w-full sm:w-36">
                                            <Select
                                                label="Category"
                                                options={skillCategories}
                                                value={newSkill.category}
                                                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                                className="mb-0"
                                            />
                                        </div>
                                        <Button onClick={addSkill} icon={Plus} className="mb-0.5">
                                            Add
                                        </Button>
                                    </div>

                                    {/* Quick Add */}
                                    <div>
                                        <p className="body-small text-[var(--color-text-tertiary)] mb-3">Popular skills:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {popularSkills.map((skill) => (
                                                <button
                                                    key={skill}
                                                    onClick={() => addQuickSkill(skill)}
                                                    disabled={skills.find(s => s.name.toLowerCase() === skill.toLowerCase())}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-light)] hover:text-[var(--color-accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-[var(--color-accent)]/20"
                                                >
                                                    + {skill}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Skills List */}
                                    {skills.length > 0 && (
                                        <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-[var(--color-border-primary)]">
                                            {skills.map((skill, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium text-[var(--color-text-primary)]">{skill.name}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-sm font-semibold ${getSkillLevelColor(skill.level)}`}>
                                                                    {skill.level}%
                                                                </span>
                                                                <span className={`px-2 py-0.5 rounded text-xs text-white ${getSkillLevelBadge(skill.level).color}`}>
                                                                    {getSkillLevelBadge(skill.level).text}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={skill.level}
                                                            onChange={(e) => {
                                                                const newSkills = [...skills];
                                                                newSkills[index].level = parseInt(e.target.value);
                                                                setSkills(newSkills);
                                                            }}
                                                            className="w-full h-2 accent-[var(--color-accent)] cursor-pointer"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeSkill(index)}
                                                        className="text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] transition-colors ml-3"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 sticky bottom-6 z-10"
                        >
                            <div className="clean-card p-2 flex flex-col sm:flex-row gap-4 w-full shadow-lg border-[var(--color-accent)]/20">
                                <Button
                                    variant="secondary"
                                    onClick={handleSave}
                                    loading={saving}
                                    icon={saved ? CheckCircle : Save}
                                    className="flex-1"
                                >
                                    {saved ? 'Saved!' : 'Save Progress'}
                                </Button>
                                <Button
                                    onClick={handleAnalyze}
                                    loading={analyzing}
                                    icon={Sparkles}
                                    className="flex-1"
                                >
                                    Analyze Profile
                                </Button>
                            </div>
                        </motion.div>

                        {/* Analysis Results */}
                        {analysis?.success && analysis?.data && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="border-[var(--color-accent)] bg-[var(--color-accent-light)]">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                                            <CardTitle>AI Analysis Report</CardTitle>
                                        </div>
                                        <CardDescription>Based on your profile and target role</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        {/* Score */}
                                        <div className="text-center p-6 rounded-xl bg-white/50 border border-[var(--color-accent)]/10">
                                            <p className="text-4xl font-bold text-[var(--color-accent)] mb-2">{analysis.data.overallScore}</p>
                                            <p className="body-small text-[var(--color-text-secondary)]">Career Readiness Score</p>
                                        </div>

                                        {/* Summary */}
                                        <p className="body text-[var(--color-text-primary)]">{analysis.data.summary}</p>

                                        {/* Skill Gaps */}
                                        {analysis.data.skillGaps?.length > 0 && (
                                            <div>
                                                <h4 className="heading-4 mb-3">Skill Gaps</h4>
                                                <div className="space-y-3">
                                                    {analysis.data.skillGaps.map((gap, i) => (
                                                        <div key={i} className="p-4 rounded-xl bg-white border border-[var(--color-border-primary)]">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-medium text-[var(--color-text-primary)]">{gap.skill}</span>
                                                                <span className={`badge ${gap.priority === 'high' ? 'badge-error' : gap.priority === 'medium' ? 'badge-warning' : 'badge-success'}`}>
                                                                    {gap.priority} priority
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-xs text-[var(--color-text-tertiary)] mb-2">
                                                                <span>Current: {gap.currentLevel}%</span>
                                                                <ChevronRight className="w-3 h-3" />
                                                                <span>Required: {gap.requiredLevel}%</span>
                                                            </div>
                                                            <p className="body-small text-[var(--color-text-secondary)]">{gap.recommendation}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Items */}
                                        {analysis.data.actionItems?.length > 0 && (
                                            <div>
                                                <h4 className="heading-4 mb-3">Recommended Actions</h4>
                                                <div className="space-y-2">
                                                    {analysis.data.actionItems.map((item, i) => (
                                                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors">
                                                            <CheckCircle className="w-5 h-5 text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <p className="body-small font-medium text-[var(--color-text-primary)]">{item.action}</p>
                                                                <p className="text-xs text-[var(--color-text-tertiary)]">{item.timeframe}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
