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
            console.log('Learning Path API Result:', result);
            console.log('Learning Path Data:', result.data);
            setLearningData(result.data || result);
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
                                        Your Personalized Learning Path
                                    </h2>
                                    <p className="body text-[var(--color-text-secondary)] mb-6">
                                        Estimated duration: <span className="font-semibold text-[var(--color-text-primary)]">{learningData.estimatedTimeframe || 'Varies'}</span>
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

                            {/* Learning Priorities */}
                            {learningData.learningPriorities?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-5 h-5 text-[var(--color-warning)]" />
                                                <CardTitle>Learning Priorities</CardTitle>
                                            </div>
                                            <CardDescription>Focus on these key areas for maximum impact</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {learningData.learningPriorities.map((priority, i) => (
                                                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-tertiary)]">
                                                        <div className="w-6 h-6 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <span className="text-xs font-bold text-[var(--color-accent)]">{i + 1}</span>
                                                        </div>
                                                        <p className="body text-[var(--color-text-primary)]">{priority}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Recommended Courses */}
                            {learningData.recommendedCourses?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-5 h-5 text-[var(--color-accent)]" />
                                                <CardTitle>Recommended Courses</CardTitle>
                                            </div>
                                            <CardDescription>{learningData.recommendedCourses.length} courses curated for your learning journey</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {learningData.recommendedCourses.map((course, i) => (
                                                    <div key={i} className="p-4 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] hover:border-[var(--color-accent)]/30 transition-colors">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <BookOpen className="w-4 h-4 text-[var(--color-accent)]" />
                                                                    <h4 className="font-semibold text-[var(--color-text-primary)]">
                                                                        {course.title}
                                                                    </h4>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)] mb-2">
                                                                    <span className="font-medium">{course.platform}</span>
                                                                    <span>•</span>
                                                                    <span>{course.duration}</span>
                                                                    <span>•</span>
                                                                    <span className="px-2 py-0.5 rounded bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                                                                        {course.level}
                                                                    </span>
                                                                </div>
                                                                <p className="body-small text-[var(--color-text-secondary)]">
                                                                    {course.description}
                                                                </p>
                                                            </div>
                                                            {course.url && (
                                                                <button
                                                                    onClick={() => {
                                                                        let url = course.url;

                                                                        // Validate and fix URL
                                                                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                                                                            url = `https://${url}`;
                                                                        }

                                                                        console.log('Opening course URL:', url);
                                                                        window.open(url, '_blank', 'noopener,noreferrer');
                                                                    }}
                                                                    className="btn-ghost btn-sm flex items-center gap-2 flex-shrink-0"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    View Course
                                                                </button>
                                                            )}
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
