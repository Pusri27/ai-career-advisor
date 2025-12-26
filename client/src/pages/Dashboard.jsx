import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Target,
    Briefcase,
    BookOpen,
    RefreshCw,
    ArrowRight,
    Zap,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAgent } from '../hooks/useAgent';
import { useRefresh } from '../context/RefreshContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import CareerScore from '../components/dashboard/CareerScore';
import SkillChart from '../components/dashboard/SkillChart';
import RecommendationCard from '../components/dashboard/RecommendationCard';
import ProgressWidget from '../components/dashboard/ProgressWidget';
import ApplicationsWidget from '../components/dashboard/ApplicationsWidget';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user, profile, refreshProfile } = useAuth();
    const { runFullAnalysis } = useAgent();
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    // Refresh profile when Dashboard loads to ensure latest skill data
    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    const isProfileComplete = profile?.currentRole && profile?.targetRole && profile?.skills?.length > 0;

    const handleAnalysis = async () => {
        if (!isProfileComplete) return;

        setAnalyzing(true);
        try {
            const result = await runFullAnalysis();
            setAnalysis(result.data);
            await refreshProfile();
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    const quickActions = [
        {
            icon: Target,
            title: 'Skill Assessment',
            description: 'Evaluate your skills and get insights',
            link: '/assessment'
        },
        {
            icon: Briefcase,
            title: 'Job Matches',
            description: 'Find opportunities for you',
            link: '/jobs'
        },
        {
            icon: BookOpen,
            title: 'Learning Path',
            description: 'Get course recommendations',
            link: '/learning'
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)]">
            <Navbar />

            <main className="pt-24 pb-12 px-4">
                <div className="container-max">
                    {/* Welcome Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="heading-2 mb-2">
                            Welcome back, {user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="body text-[var(--color-text-secondary)]">
                            Here's your career overview and personalized recommendations
                        </p>
                    </motion.div>

                    {/* Profile Incomplete Warning */}
                    {!isProfileComplete && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="clean-card p-6 mb-8 bg-[var(--color-warning-light)] border-[var(--color-warning)]"
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-[var(--color-warning)]/20">
                                        <Zap className="w-6 h-6 text-[var(--color-warning)]" />
                                    </div>
                                    <div>
                                        <h3 className="heading-4 mb-1">Complete Your Profile</h3>
                                        <p className="body-small text-[var(--color-text-secondary)]">
                                            Add your skills, current role, and target role to unlock AI insights
                                        </p>
                                    </div>
                                </div>
                                <Link to="/assessment">
                                    <Button icon={ArrowRight} iconPosition="right">
                                        Complete Now
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Career Score & Skills */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Career Score */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle>Career Readiness</CardTitle>
                                            <CardDescription>Your overall career score</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-col items-center py-4">
                                            <CareerScore score={profile?.careerScore || 0} />
                                            {isProfileComplete && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="mt-4"
                                                    onClick={handleAnalysis}
                                                    disabled={analyzing}
                                                    icon={RefreshCw}
                                                >
                                                    {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Skills Chart */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle>Skill Overview</CardTitle>
                                            <CardDescription>Your top skills</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <SkillChart
                                                skills={profile?.skills || []}
                                                key={JSON.stringify(profile?.skills?.map(s => `${s.name}-${s.level}`))}
                                            />
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Quick Insights Widgets */}
                            <div className="mb-8">
                                <h2 className="heading-3 mb-4">Quick Insights</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <ProgressWidget />
                                    <ApplicationsWidget />
                                </div>
                            </div>

                            {/* Analysis Results */}
                            {analysis?.skillAnalysis?.success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                                                <CardTitle>AI Analysis Results</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Summary */}
                                            <p className="body text-[var(--color-text-primary)]">
                                                {analysis.skillAnalysis.data?.summary}
                                            </p>

                                            {/* Strengths */}
                                            {analysis.skillAnalysis.data?.strengths?.length > 0 && (
                                                <div>
                                                    <h4 className="body font-semibold mb-2">Your Strengths</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {analysis.skillAnalysis.data.strengths.map((strength, i) => (
                                                            <span key={i} className="badge badge-success">{strength}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Items */}
                                            {analysis.skillAnalysis.data?.actionItems?.length > 0 && (
                                                <div>
                                                    <h4 className="body font-semibold mb-3">Recommended Actions</h4>
                                                    <div className="space-y-3">
                                                        {analysis.skillAnalysis.data.actionItems.slice(0, 3).map((item, i) => (
                                                            <div key={i} className="p-4 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                                                                <div className="flex items-start gap-3">
                                                                    <span className={`badge ${item.impact === 'high' ? 'badge-warning' : 'badge-primary'}`}>
                                                                        {item.impact}
                                                                    </span>
                                                                    <div className="flex-1">
                                                                        <p className="body-small font-medium text-[var(--color-text-primary)] mb-1">
                                                                            {item.action}
                                                                        </p>
                                                                        <p className="body-small text-[var(--color-text-tertiary)]">
                                                                            {item.timeframe}
                                                                        </p>
                                                                    </div>
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

                            {/* Profile Summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Your Career Profile</CardTitle>
                                        <CardDescription>Current status and goals</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="stat-card">
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Current Role</p>
                                                <p className="body font-medium text-[var(--color-text-primary)]">
                                                    {profile?.currentRole || 'Not set'}
                                                </p>
                                            </div>
                                            <div className="stat-card">
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Target Role</p>
                                                <p className="body font-medium text-[var(--color-text-primary)]">
                                                    {profile?.targetRole || 'Not set'}
                                                </p>
                                            </div>
                                            <div className="stat-card">
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Experience</p>
                                                <p className="body font-medium text-[var(--color-text-primary)]">
                                                    {profile?.yearsOfExperience || 0} years
                                                </p>
                                            </div>
                                            <div className="stat-card">
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Industry</p>
                                                <p className="body font-medium text-[var(--color-text-primary)]">
                                                    {profile?.industry || 'Not set'}
                                                </p>
                                            </div>
                                        </div>
                                        <Link to="/assessment" className="block mt-4">
                                            <Button variant="secondary" className="w-full">
                                                Edit Profile
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Right Column - Quick Actions */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h2 className="heading-4 mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    {quickActions.map((action, index) => (
                                        <RecommendationCard
                                            key={index}
                                            {...action}
                                            actionText="Start"
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            {/* AI Chat Promo */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Card className="bg-[var(--color-accent-light)] border-[var(--color-accent)]">
                                    <CardContent className="text-center py-8">
                                        <Sparkles className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
                                        <h3 className="heading-4 mb-2">
                                            Chat with AI Advisor
                                        </h3>
                                        <p className="body-small text-[var(--color-text-secondary)] mb-4">
                                            Get instant answers to your career questions
                                        </p>
                                        <Link to="/chat">
                                            <Button icon={ArrowRight} iconPosition="right">
                                                Start Chat
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
