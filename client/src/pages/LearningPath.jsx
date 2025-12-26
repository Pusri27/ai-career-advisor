import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    BookOpen,
    ExternalLink,
    Sparkles,
    CheckCircle,
    Trophy,
    Zap,
    Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAgent } from '../hooks/useAgent';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function LearningPath() {
    const { profile } = useAuth();
    const { getLearningPath } = useAgent();
    const [learningData, setLearningData] = useState(null);
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const result = await getLearningPath();
            setLearningData(result.data);
        } catch (error) {
            console.error('Failed to generate learning path:', error);
        } finally {
            setGenerating(false);
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
                        <h1 className="heading-2 mb-2">Learning Path</h1>
                        <p className="body text-[var(--color-text-secondary)]">
                            Curated resources and milestones to accelerate your growth.
                        </p>
                    </motion.div>

                    {/* Generate Button */}
                    {!learningData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="text-center py-16 bg-[var(--color-bg-primary)] border-dashed border-2 border-[var(--color-border-primary)] shadow-none">
                                <div className="w-20 h-20 bg-[var(--color-accent-light)] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <GraduationCap className="w-8 h-8 text-[var(--color-accent)]" />
                                </div>
                                <h3 className="heading-3 mb-2">
                                    Get Your Personalized Learning Plan
                                </h3>
                                <p className="body text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
                                    Our AI analyzes your current skills and career goals to build a custom curriculum just for you.
                                </p>
                                <Button
                                    onClick={handleGenerate}
                                    loading={generating}
                                    icon={Sparkles}
                                    size="lg"
                                >
                                    Generate Learning Path
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {/* Learning Path Results */}
                    {learningData && (
                        <div className="space-y-8">
                            {/* Path Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="p-8 rounded-xl bg-[var(--color-accent-light)] border border-[var(--color-accent)]/20 text-center">
                                    <Trophy className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
                                    <h2 className="heading-2 mb-2">
                                        {learningData.learningPath?.title || 'Your Learning Path'}
                                    </h2>
                                    <p className="body text-[var(--color-text-secondary)] mb-6">
                                        Estimated duration: <span className="font-semibold text-[var(--color-text-primary)]">{learningData.learningPath?.duration || 'Varies'}</span>
                                    </p>
                                    <Button
                                        variant="secondary"
                                        onClick={handleGenerate}
                                        loading={generating}
                                        icon={Sparkles}
                                        size="sm"
                                    >
                                        Regenerate Plan
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Quick Wins */}
                            {learningData.quickWins?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-5 h-5 text-[var(--color-warning)]" />
                                                <CardTitle>Quick Wins</CardTitle>
                                            </div>
                                            <CardDescription>High-impact actions you can take this week</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {learningData.quickWins.map((win, i) => (
                                                    <div key={i} className="p-4 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                                                        <p className="font-semibold text-[var(--color-text-primary)] mb-1">{win.skill}</p>
                                                        <p className="body-small text-[var(--color-text-secondary)] mb-3">{win.resource}</p>
                                                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
                                                            <div className="w-4 h-4 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)]">
                                                                <Clock className="w-3 h-3" />
                                                            </div>
                                                            {win.time}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Learning Phases */}
                            <div className="space-y-6">
                                {learningData.learningPath?.phases?.map((phase, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="clean-card overflow-hidden"
                                    >
                                        <div className="p-6 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)] flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)] font-bold text-lg flex-shrink-0">
                                                {phase.phase}
                                            </div>
                                            <div>
                                                <h3 className="heading-4 mb-1">{phase.title}</h3>
                                                <p className="body-small text-[var(--color-text-secondary)]">Focus: {phase.focus} • {phase.duration}</p>
                                            </div>
                                        </div>

                                        <div className="divide-y divide-[var(--color-border-primary)]">
                                            {phase.resources?.map((resource, i) => (
                                                <div
                                                    key={i}
                                                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`p-2 rounded-lg mt-0.5 ${resource.type === 'course' ? 'bg-blue-50 text-blue-600' :
                                                            resource.type === 'book' ? 'bg-emerald-50 text-emerald-600' :
                                                                resource.type === 'project' ? 'bg-amber-50 text-amber-600' :
                                                                    'bg-purple-50 text-purple-600'
                                                            }`}>
                                                            {resource.type === 'course' ? <BookOpen className="w-5 h-5" /> :
                                                                resource.type === 'book' ? <BookOpen className="w-5 h-5" /> :
                                                                    <GraduationCap className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-[var(--color-text-primary)]">{resource.name}</p>
                                                            <div className="flex items-center gap-2 mt-1 body-small text-[var(--color-text-tertiary)]">
                                                                <span>{resource.provider}</span>
                                                                <span>•</span>
                                                                <span>{resource.estimatedTime}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 pl-14 sm:pl-0">
                                                        {resource.isFree && (
                                                            <span className="badge badge-success">Free</span>
                                                        )}
                                                        {resource.url && resource.url !== 'search on [platform]' && (
                                                            <button
                                                                onClick={() => {
                                                                    let url = resource.url;

                                                                    // Validate and fix URL
                                                                    if (!url.startsWith('http://') && !url.startsWith('https://')) {
                                                                        url = `https://${url}`;
                                                                    }

                                                                    // If URL seems invalid, search instead
                                                                    if (!url.includes('.') || url.includes('[') || url.includes(']')) {
                                                                        const searchQuery = encodeURIComponent(`${resource.name} ${resource.provider} course`);
                                                                        url = `https://www.google.com/search?q=${searchQuery}`;
                                                                    }

                                                                    console.log('Opening URL:', url);
                                                                    window.open(url, '_blank', 'noopener,noreferrer');
                                                                }}
                                                                className="btn-ghost btn-sm flex items-center gap-2"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                                View Course
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Certifications */}
                            {learningData.certifications?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <Trophy className="w-5 h-5 text-[var(--color-warning)]" />
                                                <CardTitle>Recommended Certifications</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {learningData.certifications.map((cert, i) => (
                                                    <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                                                        <GraduationCap className="w-6 h-6 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div>
                                                                    <p className="font-semibold text-[var(--color-text-primary)]">{cert.name}</p>
                                                                    <p className="body-small text-[var(--color-text-secondary)] mb-2">{cert.provider}</p>
                                                                </div>
                                                                <span className="badge flex-shrink-0 bg-white border border-[var(--color-border-primary)]">{cert.cost}</span>
                                                            </div>
                                                            <p className="body-small text-[var(--color-text-tertiary)]">{cert.relevance}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Daily Habits */}
                            {learningData.dailyHabits?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                                                <CardTitle>Habits for Success</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                {learningData.dailyHabits.map((habit, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-tertiary)]">
                                                        <div className="w-6 h-6 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                            {i + 1}
                                                        </div>
                                                        <span className="body-small text-[var(--color-text-primary)]">{habit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
