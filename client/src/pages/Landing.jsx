import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Target,
    TrendingUp,
    Brain,
    Zap,
    ArrowRight,
    CheckCircle,
    BarChart3
} from 'lucide-react';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const features = [
    {
        icon: Brain,
        title: 'AI Analysis',
        description: 'Personalized career insights powered by advanced AI'
    },
    {
        icon: Target,
        title: 'Skill Gaps',
        description: 'Identify exactly what you need to develop'
    },
    {
        icon: TrendingUp,
        title: 'Career Path',
        description: 'Step-by-step roadmap to your dream role'
    },
    {
        icon: Zap,
        title: 'Job Matching',
        description: 'Find opportunities that match your profile'
    }
];

const stats = [
    { value: '95%', label: 'Success Rate' },
    { value: '10k+', label: 'Users Helped' },
    { value: '50+', label: 'Career Paths' },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)]">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="container-max">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent-light)] border border-[var(--color-accent)]/20 mb-6">
                            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                            <span className="body-small font-medium text-[var(--color-accent)]">
                                AI-Powered Career Guidance
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="heading-1 mb-6">
                            Navigate Your Career with
                            <span className="text-gradient"> AI Intelligence</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="body-large max-w-2xl mx-auto mb-8 text-[var(--color-text-secondary)]">
                            Get personalized career advice, skill gap analysis, and job recommendations.
                            Your path to success starts here.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <Link to="/register">
                                <Button size="lg" icon={ArrowRight} iconPosition="right">
                                    Start Free Analysis
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="secondary" size="lg">
                                    Sign In
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-[var(--color-border-primary)]">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="heading-3 text-[var(--color-accent)]">{stat.value}</div>
                                    <div className="body-small text-[var(--color-text-tertiary)]">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="container-max">
                    <div className="text-center mb-12 max-w-2xl mx-auto">
                        <h2 className="heading-2 mb-4">
                            Everything you need to advance
                        </h2>
                        <p className="body text-[var(--color-text-secondary)]">
                            Four specialized AI agents work together to analyze your profile
                            and provide comprehensive career guidance.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="clean-card text-center h-full">
                                    <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="w-6 h-6 text-[var(--color-accent)]" />
                                    </div>
                                    <h3 className="heading-4 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="body-small text-[var(--color-text-tertiary)]">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 bg-[var(--color-bg-primary)]">
                <div className="container-sm">
                    <div className="text-center mb-12">
                        <h2 className="heading-2 mb-4">
                            Simple, powerful workflow
                        </h2>
                        <p className="body text-[var(--color-text-secondary)]">
                            Get actionable insights in minutes, not hours
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                step: '01',
                                title: 'Complete your profile',
                                description: 'Tell us about your skills, experience, and career goals'
                            },
                            {
                                step: '02',
                                title: 'AI analyzes your data',
                                description: 'Our specialized agents evaluate your profile and market trends'
                            },
                            {
                                step: '03',
                                title: 'Get your personalized plan',
                                description: 'Receive tailored recommendations and actionable steps'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="clean-card"
                            >
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center">
                                            <span className="font-bold text-[var(--color-accent)]">{item.step}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h3 className="heading-4 mb-2">{item.title}</h3>
                                        <p className="body text-[var(--color-text-secondary)]">{item.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4">
                <div className="container-max">
                    <div className="clean-card p-12">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="badge badge-primary mb-4">
                                    <BarChart3 className="w-3 h-3" />
                                    <span>Comprehensive Analysis</span>
                                </div>
                                <h2 className="heading-2 mb-4">
                                    Accelerate your career growth
                                </h2>
                                <p className="body text-[var(--color-text-secondary)] mb-8">
                                    Our AI analyzes your profile, identifies opportunities, and creates
                                    a personalized action plan to help you reach your goals faster.
                                </p>
                                <Link to="/register">
                                    <Button icon={ArrowRight} iconPosition="right">
                                        Get Started Free
                                    </Button>
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {[
                                    'Personalized AI career coaching',
                                    'Real-time job market insights',
                                    'Skill-based learning paths',
                                    'Interview preparation',
                                    'Salary negotiation guidance',
                                    'Network building strategies'
                                ].map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                                        <span className="body text-[var(--color-text-primary)]">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4">
                <div className="container-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="clean-card p-12 text-center bg-[var(--color-accent-light)]"
                    >
                        <h2 className="heading-2 mb-4">
                            Ready to take control?
                        </h2>
                        <p className="body text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto">
                            Join thousands of professionals using AI to navigate their career paths more effectively.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" icon={Sparkles}>
                                    Start Free Analysis
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="secondary" size="lg">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
