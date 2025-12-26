import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Target,
    MapPin,
    Briefcase,
    GraduationCap,
    MessageCircle,
    LogOut,
    User,
    Menu,
    X,
    TrendingUp,
    Clipboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

// Grouped navigation items for better organization
const navGroups = {
    core: [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/assessment', icon: Target, label: 'Assessment' },
        { path: '/progress', icon: TrendingUp, label: 'Progress' },
    ],
    career: [
        { path: '/roadmap', icon: MapPin, label: 'Roadmap' },
        { path: '/jobs', icon: Briefcase, label: 'Jobs' },
        { path: '/applications', icon: Clipboard, label: 'Applications' },
    ],
    tools: [
        { path: '/learning', icon: GraduationCap, label: 'Learning' },
        { path: '/chat', icon: MessageCircle, label: 'AI Chat' },
    ]
};

// Flatten for easy iteration
const allNavItems = [...navGroups.core, ...navGroups.career, ...navGroups.tools];

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg-primary)]/95 border-b border-[var(--color-border-primary)] backdrop-blur-md">
            <div className="container-max">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-purple-600 flex items-center justify-center shadow-lg">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <span className="heading-4 text-gradient hidden sm:block">
                            CareerAI
                        </span>
                    </Link>

                    {/* Desktop Nav - Grouped */}
                    {user && (
                        <div className="hidden lg:flex items-center gap-6">
                            {/* Core */}
                            <div className="flex items-center gap-1">
                                {navGroups.core.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                                    ? 'text-[var(--color-accent)]'
                                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-indicator"
                                                    className="absolute inset-0 bg-[var(--color-accent-light)] rounded-lg"
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                                />
                                            )}
                                            <item.icon className="w-4 h-4 relative z-10" />
                                            <span className="relative z-10">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Divider */}
                            <div className="w-px h-6 bg-[var(--color-border-primary)]" />

                            {/* Career */}
                            <div className="flex items-center gap-1">
                                {navGroups.career.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                                    ? 'text-[var(--color-accent)]'
                                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-indicator"
                                                    className="absolute inset-0 bg-[var(--color-accent-light)] rounded-lg"
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                                />
                                            )}
                                            <item.icon className="w-4 h-4 relative z-10" />
                                            <span className="relative z-10">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Divider */}
                            <div className="w-px h-6 bg-[var(--color-border-primary)]" />

                            {/* Tools */}
                            <div className="flex items-center gap-1">
                                {navGroups.tools.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                                    ? 'text-[var(--color-accent)]'
                                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-indicator"
                                                    className="absolute inset-0 bg-[var(--color-accent-light)] rounded-lg"
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                                />
                                            )}
                                            <item.icon className="w-4 h-4 relative z-10" />
                                            <span className="relative z-10">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* User Menu */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-purple-600 flex items-center justify-center">
                                        <User className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="body-small font-medium text-[var(--color-text-primary)]">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                                {/* Mobile menu button */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="lg:hidden p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all"
                                >
                                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="btn-ghost">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Improved */}
            {user && mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden border-t border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]"
                >
                    <div className="container-max py-4">
                        {/* User Info Mobile */}
                        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-purple-600 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="body-small font-medium text-[var(--color-text-primary)]">{user.name}</p>
                                <p className="body-small text-[var(--color-text-tertiary)]">{user.email}</p>
                            </div>
                        </div>

                        {/* Core Section */}
                        <div className="mb-4">
                            <p className="px-4 mb-2 body-small font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Core</p>
                            <div className="space-y-1">
                                {navGroups.core.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                                    ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Career Section */}
                        <div className="mb-4">
                            <p className="px-4 mb-2 body-small font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Career</p>
                            <div className="space-y-1">
                                {navGroups.career.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                                    ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tools Section */}
                        <div className="mb-4">
                            <p className="px-4 mb-2 body-small font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Tools</p>
                            <div className="space-y-1">
                                {navGroups.tools.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                                    ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Logout Mobile */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
