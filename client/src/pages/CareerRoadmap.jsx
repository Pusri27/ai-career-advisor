import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Target, ChevronRight, Sparkles, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAgent } from '../hooks/useAgent';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function CareerRoadmap() {
    const { profile } = useAuth();
    const { getCareerAdvice } = useAgent();
    const [roadmap, setRoadmap] = useState(null);
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const result = await getCareerAdvice();
            setRoadmap(result.data);
        } catch (error) {
            console.error('Failed:', error);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-bg-secondary)]">
            <Navbar />
            <main className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="heading-2 mb-2">Career Roadmap</h1>
                        <p className="body text-[var(--color-text-secondary)]">
                            AI-generated career path from {profile?.currentRole || 'current role'} to {profile?.targetRole || 'target role'}
                        </p>
                    </motion.div>

                    {!roadmap ? (
                        <Card className="text-center py-16 bg-[var(--color-bg-primary)] border-dashed border-2 border-[var(--color-border-primary)] shadow-none">
                            <div className="w-20 h-20 bg-[var(--color-accent-light)] rounded-full flex items-center justify-center mx-auto mb-6">
                                <MapPin className="w-8 h-8 text-[var(--color-accent)]" />
                            </div>
                            <h3 className="heading-3 mb-2">Generate Your Career Roadmap</h3>
                            <p className="body text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
                                Get a personalized step-by-step guide tailored to your unique skills and goals.
                            </p>
                            <Button onClick={handleGenerate} loading={generating} icon={Sparkles} size="lg">
                                {generating ? 'Generating...' : 'Generate Roadmap'}
                            </Button>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            {/* Career Paths */}
                            {roadmap.careerPaths?.map((path, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <div className="clean-card p-0 overflow-hidden">
                                        <div className="p-6 md:p-8 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)]">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center flex-shrink-0">
                                                        <Target className="w-6 h-6 text-[var(--color-accent)]" />
                                                    </div>
                                                    <div>
                                                        <h3 className="heading-3 text-[var(--color-text-primary)] mb-1">{path.title}</h3>
                                                        <div className="flex items-center gap-4 text-sm text-[var(--color-text-tertiary)]">
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-4 h-4" />
                                                                <span>{path.timeline}</span>
                                                            </div>
                                                            <div className="px-2 py-0.5 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] font-medium">
                                                                {path.fitScore}% Match
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="body text-[var(--color-text-secondary)] mt-4 max-w-2xl">{path.description}</p>
                                        </div>

                                        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                                            {/* Left: Steps */}
                                            <div>
                                                <h4 className="heading-4 mb-4 flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center text-xs font-bold text-[var(--color-text-secondary)]">1</span>
                                                    Milestones
                                                </h4>
                                                <div className="relative pl-4 border-l border-[var(--color-border-primary)] space-y-6">
                                                    {path.steps?.map((step, j) => (
                                                        <div key={j} className="relative pl-6">
                                                            <div className="absolute top-1.5 -left-[21px] w-3 h-3 rounded-full bg-[var(--color-accent)] border border-white box-content" />
                                                            <p className="body-small text-[var(--color-text-primary)]">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Right: Skills */}
                                            <div>
                                                <h4 className="heading-4 mb-4 flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center text-xs font-bold text-[var(--color-text-secondary)]">2</span>
                                                    Required Skills
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {path.requiredSkills?.map((skill, j) => (
                                                        <span key={j} className="px-3 py-1.5 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-md text-sm text-[var(--color-text-secondary)]">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Immediate Actions */}
                            {roadmap.immediateActions?.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>🎯 Immediate Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {roadmap.immediateActions.map((action, i) => (
                                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                                                    <CheckCircle className="w-5 h-5 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-[var(--color-text-primary)]">{action.action}</p>
                                                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{action.reason}</p>
                                                    </div>
                                                    <span className="badge badge-warning flex-shrink-0 text-xs">{action.deadline}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Industry Insights */}
                            {roadmap.industryInsights && (
                                <div className="p-6 rounded-xl bg-[var(--color-accent-light)] border border-[var(--color-accent)]/20">
                                    <div className="flex items-start gap-4">
                                        <Sparkles className="w-6 h-6 text-[var(--color-accent)] flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Industry Insights</h3>
                                            <p className="body text-[var(--color-text-secondary)]">{roadmap.industryInsights}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center">
                                <Button variant="ghost" onClick={handleGenerate} icon={Sparkles}>
                                    Regenerate Roadmap
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
