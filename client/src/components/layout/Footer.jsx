import { Link } from 'react-router-dom';
import { Target, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="md:col-span-4">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
                            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <span className="heading-4 text-[var(--color-text-primary)]">CareerAI</span>
                        </Link>
                        <p className="body-small text-[var(--color-text-secondary)] mb-6 max-w-xs">
                            AI-powered career guidance platform helping professionals achieve their career goals.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all"
                                aria-label="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:hello@careerai.com"
                                className="w-9 h-9 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all"
                                aria-label="Email"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="md:col-span-2">
                        <h3 className="body font-semibold text-[var(--color-text-primary)] mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/assessment" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">Skill Assessment</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/roadmap" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">Career Roadmap</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/jobs" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">Job Matching</span>
                                </Link>
                            </li>
                            <footer className="bg-[var(--color-bg-primary)] border-t border-[var(--color-border-primary)] py-8">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {/* About */}
                                        <div>
                                            <h3 className="font-semibold mb-4 text-[var(--color-text-primary)]">
                                                About CareerAI
                                            </h3>
                                            <p className="body-small text-[var(--color-text-secondary)]">
                                                AI-powered career guidance platform helping professionals achieve their career goals through personalized insights and recommendations.
                                            </p>
                                        </div>

                                        {/* Quick Links */}
                                        <div>
                                            <h3 className="font-semibold mb-4 text-[var(--color-text-primary)]">
                                                Quick Links
                                            </h3>
                                            <ul className="space-y-2">
                                                <li>
                                                    <Link
                                                        to="/dashboard"
                                                        className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                                                    >
                                                        Dashboard
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/progress"
                                                        className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                                                    >
                                                        Progress
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/learning-path"
                                                        className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                                                    >
                                                        Learning Path
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Contact */}
                                        <div>
                                            <h3 className="font-semibold mb-4 text-[var(--color-text-primary)]">
                                                Connect
                                            </h3>
                                            <p className="body-small text-[var(--color-text-secondary)] mb-3">
                                                Built with AI to empower your career journey
                                            </p>
                                            <div className="flex gap-3">
                                                <a
                                                    href="https://github.com/Pusri27/ai-career-advisor"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Bar */}
                                </a>
                            </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
