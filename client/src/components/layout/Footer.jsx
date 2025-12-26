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
                            <li>
                                <Link to="/learning" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">Learning Path</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/chat" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">AI Chat</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="md:col-span-3">
                        <h3 className="body font-semibold text-[var(--color-text-primary)] mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">Documentation</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">API Reference</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">Career Blog</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">Help Center</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="md:col-span-3">
                        <h3 className="body font-semibold text-[var(--color-text-primary)] mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">Privacy Policy</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">Terms of Service</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="body-small text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform">Cookie Policy</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[var(--color-border-primary)]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="body-small text-[var(--color-text-tertiary)]">
                            © {currentYear} CareerAI. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="body-small text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors">
                                Status
                            </a>
                            <a href="#" className="body-small text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors">
                                Changelog
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
