import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    MapPin,
    DollarSign,
    ExternalLink,
    Search,
    Sparkles,
    Building,
    Star,
    Check,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAgent } from '../hooks/useAgent';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { jobsAPI } from '../services/api';

export default function JobRecommendations() {
    const { profile } = useAuth();
    const { matchJobs } = useAgent();

    // Search section state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    // AI Recommendations section state
    const [aiJobs, setAiJobs] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    // Manual search (no AI analysis)
    const handleManualSearch = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const response = await jobsAPI.search({ query: searchQuery, limit: 10 });
            setSearchResults(response.data.data || []);
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    // AI-powered recommendations
    const handleAIRecommendations = async () => {
        setAnalyzing(true);
        try {
            const result = await matchJobs();
            setAiJobs(result.jobs || []);
            setAnalysis(result.analysis);
        } catch (error) {
            console.error('AI matching failed:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    // Auto-load latest jobs on component mount
    useEffect(() => {
        const fetchLatestJobs = async () => {
            setSearching(true);
            try {
                // Fetch latest developer jobs by default
                const response = await jobsAPI.search({ query: 'developer', limit: 10 });
                setSearchResults(response.data.data || []);
            } catch (error) {
                console.error('Failed to load latest jobs:', error);
            } finally {
                setSearching(false);
            }
        };

        fetchLatestJobs();
    }, []);

    const getMatchScore = (jobIndex) => {
        if (!analysis?.rankedJobs) return null;
        const match = analysis.rankedJobs.find(r => r.jobIndex === jobIndex);
        return match?.matchScore || null;
    };

    const getMatchDetails = (jobIndex) => {
        if (!analysis?.rankedJobs) return null;
        return analysis.rankedJobs.find(r => r.jobIndex === jobIndex);
    };

    const JobCard = ({ job, matchScore = null, matchDetails = null, showAIBadge = false }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="clean-card p-6 hover:shadow-md transition-shadow"
        >
            <div className="flex flex-col md:flex-row gap-6">
                {/* Company Logo */}
                <div className="w-16 h-16 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center overflow-hidden flex-shrink-0 border border-[var(--color-border-primary)]">
                    {job.employer_logo ? (
                        <img
                            src={job.employer_logo}
                            alt={job.employer_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>`;
                            }}
                        />
                    ) : (
                        <Building className="w-8 h-8 text-[var(--color-text-tertiary)]" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                            <h3 className="heading-4 text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer">
                                {job.job_title}
                            </h3>
                            <p className="body-small text-[var(--color-text-tertiary)] font-medium">
                                {job.employer_name}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {showAIBadge && (
                                <span className="badge bg-[var(--color-accent-light)] text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    AI Match
                                </span>
                            )}
                            {matchScore !== null && (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-success)]/10 border border-[var(--color-success)]/20">
                                    <Star className="w-3.5 h-3.5 text-[var(--color-success)] fill-[var(--color-success)]" />
                                    <span className="text-xs font-semibold text-[var(--color-success)]">
                                        {matchScore}% Match
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)] mb-4">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                            {job.job_city || 'Remote'}, {job.job_country || ''}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                            {job.job_employment_type || 'Full-time'}
                        </span>
                        {(job.job_min_salary || job.job_max_salary) && (
                            <span className="flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                                ${job.job_min_salary?.toLocaleString() || '?'} - ${job.job_max_salary?.toLocaleString() || '?'}
                            </span>
                        )}
                        {job.job_is_remote && (
                            <span className="badge badge-success">Remote</span>
                        )}
                    </div>

                    <p className="body-small text-[var(--color-text-secondary)] line-clamp-2 mb-4">
                        {job.job_description}
                    </p>

                    {matchDetails?.matchReasons?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {matchDetails.matchReasons.slice(0, 3).map((reason, i) => (
                                <span key={i} className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-[var(--color-success)]/5 text-[var(--color-success)] border border-[var(--color-success)]/10">
                                    <Check className="w-3 h-3" />
                                    {reason}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-primary)]">
                        <div className="text-xs text-[var(--color-text-tertiary)]">
                            Posted via {job.job_publisher || 'Aggregator'}
                        </div>
                        {job.job_apply_link && (
                            <a
                                href={job.job_apply_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={ExternalLink}
                                    iconPosition="right"
                                >
                                    Apply Now
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-bg-secondary)]">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="heading-2 mb-2">Job Opportunities</h1>
                        <p className="body text-[var(--color-text-secondary)]">
                            Search for jobs or get AI-powered recommendations based on your profile
                        </p>
                    </motion.div>

                    {/* SECTION 1: Manual Search */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="heading-3 flex items-center gap-2">
                                    <Search className="w-5 h-5 text-[var(--color-accent)]" />
                                    Search Jobs
                                </h2>
                                <p className="body-small text-[var(--color-text-tertiary)] mt-1">
                                    Find jobs by title, company, or keywords
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="clean-card p-4 mb-6 bg-[var(--color-bg-primary)] border-[var(--color-border-primary)] flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-tertiary)]" />
                                <Input
                                    placeholder="e.g. Frontend Developer, React, Python..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                                    className="pl-12 mb-0"
                                />
                            </div>
                            <Button
                                onClick={handleManualSearch}
                                loading={searching}
                                icon={Search}
                            >
                                Search
                            </Button>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 ? (
                            <div className="space-y-4">
                                {searchResults.map((job, index) => (
                                    <JobCard key={job.job_id || index} job={job} />
                                ))}
                            </div>
                        ) : searching ? (
                            <div className="clean-card p-12 text-center">
                                <div className="animate-pulse">
                                    <Search className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-4" />
                                    <p className="body text-[var(--color-text-secondary)]">Searching...</p>
                                </div>
                            </div>
                        ) : searchQuery ? (
                            <div className="clean-card p-12 text-center">
                                <Search className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-4" />
                                <p className="body text-[var(--color-text-secondary)]">No results found. Try different keywords.</p>
                            </div>
                        ) : null}
                    </div>

                    {/* SECTION 2: AI Recommendations */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="heading-3 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                                    AI Recommendations
                                </h2>
                                <p className="body-small text-[var(--color-text-tertiary)] mt-1">
                                    Jobs matched to your skills and career goals
                                </p>
                            </div>
                            <Button
                                onClick={handleAIRecommendations}
                                loading={analyzing}
                                icon={TrendingUp}
                            >
                                Get Recommendations
                            </Button>
                        </div>

                        {/* AI Analysis Insights */}
                        {analysis && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6"
                            >
                                <div className="p-6 rounded-xl bg-[var(--color-accent-light)] border border-[var(--color-accent)]/20">
                                    <div className="flex items-start gap-4">
                                        <Sparkles className="w-5 h-5 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="heading-4 mb-2">Market Analysis</h3>
                                            <p className="body text-[var(--color-text-secondary)] mb-4">{analysis.overallMarketFit}</p>
                                            {analysis.skillsInDemand?.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="text-sm font-medium text-[var(--color-text-tertiary)] mt-1">Trending skills:</span>
                                                    {analysis.skillsInDemand.map((skill, i) => (
                                                        <span key={i} className="px-2 py-1 bg-white rounded-md text-xs font-medium text-[var(--color-text-primary)] border border-[var(--color-border-primary)]">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* AI Recommended Jobs */}
                        {aiJobs.length > 0 ? (
                            <div className="space-y-4">
                                {aiJobs.map((job, index) => {
                                    const matchScore = getMatchScore(index);
                                    const matchDetails = getMatchDetails(index);
                                    return (
                                        <JobCard
                                            key={job.job_id || index}
                                            job={job}
                                            matchScore={matchScore}
                                            matchDetails={matchDetails}
                                            showAIBadge={true}
                                        />
                                    );
                                })}
                            </div>
                        ) : analyzing ? (
                            <div className="clean-card p-12 text-center">
                                <div className="animate-pulse">
                                    <Sparkles className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
                                    <p className="body text-[var(--color-text-secondary)]">AI is analyzing your profile...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="clean-card p-12 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-light)] flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-[var(--color-accent)]" />
                                </div>
                                <h3 className="heading-4 mb-2">Get Personalized Recommendations</h3>
                                <p className="body text-[var(--color-text-secondary)] mb-6 max-w-sm mx-auto">
                                    Our AI will analyze your profile and find the best job matches for you
                                </p>
                                <Button onClick={handleAIRecommendations} icon={Sparkles}>
                                    Analyze & Match
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
