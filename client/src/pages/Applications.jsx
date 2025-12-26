import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Briefcase, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import applicationsAPI from '../services/applications.api';
import { format } from 'date-fns';

const STATUS_COLUMNS = [
    { id: 'saved', title: 'Saved', color: 'bg-gray-500' },
    { id: 'applied', title: 'Applied', color: 'bg-blue-500' },
    { id: 'interview', title: 'Interview', color: 'bg-yellow-500' },
    { id: 'offer', title: 'Offer', color: 'bg-green-500' },
    { id: 'rejected', title: 'Rejected', color: 'bg-red-500' }
];

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: '',
        location: '',
        status: 'saved'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [appsRes, statsRes] = await Promise.all([
                applicationsAPI.getAll(),
                applicationsAPI.getStats()
            ]);
            setApplications(appsRes.data.data);
            setStats(statsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await applicationsAPI.create({
                ...formData,
                appliedDate: formData.status === 'applied' ? new Date() : null
            });
            setShowForm(false);
            setFormData({ jobTitle: '', company: '', location: '', status: 'saved' });
            fetchData();
        } catch (error) {
            console.error('Failed to create application:', error);
        }
    };

    const handleStatusChange = async (appId, newStatus) => {
        try {
            await applicationsAPI.updateStatus(appId, newStatus);
            fetchData();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const groupedApplications = STATUS_COLUMNS.reduce((acc, column) => {
        acc[column.id] = applications.filter(app => app.status === column.id);
        return acc;
    }, {});

    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-bg-secondary)]">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="heading-2 mb-2">Job Applications</h1>
                                <p className="body text-[var(--color-text-secondary)]">
                                    Track and manage your job applications
                                </p>
                            </div>
                            <Button onClick={() => setShowForm(true)} icon={Plus}>
                                Add Application
                            </Button>
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Total Applications</p>
                                                <p className="heading-3">{stats.total}</p>
                                            </div>
                                            <Briefcase className="w-8 h-8 text-[var(--color-accent)]" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Response Rate</p>
                                                <p className="heading-3">{stats.responseRate}%</p>
                                            </div>
                                            <TrendingUp className="w-8 h-8 text-blue-500" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Interviews</p>
                                                <p className="heading-3">{stats.byStatus?.interview || 0}</p>
                                            </div>
                                            <CheckCircle className="w-8 h-8 text-yellow-500" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="body-small text-[var(--color-text-tertiary)] mb-1">Offers</p>
                                                <p className="heading-3">{stats.byStatus?.offer || 0}</p>
                                            </div>
                                            <CheckCircle className="w-8 h-8 text-green-500" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    )}

                    {/* Kanban Board */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {STATUS_COLUMNS.map((column, colIndex) => (
                            <motion.div
                                key={column.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: colIndex * 0.1 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${column.color}`} />
                                            <CardTitle className="text-sm">{column.title}</CardTitle>
                                            <span className="ml-auto badge badge-secondary">
                                                {groupedApplications[column.id]?.length || 0}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {groupedApplications[column.id]?.map((app) => (
                                                <div
                                                    key={app._id}
                                                    className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border-primary)] cursor-pointer hover:border-[var(--color-accent)] transition-colors"
                                                >
                                                    <h4 className="body-small font-semibold mb-1">{app.jobTitle}</h4>
                                                    <p className="body-small text-[var(--color-text-tertiary)] mb-2">{app.company}</p>
                                                    {app.appliedDate && (
                                                        <p className="body-small text-[var(--color-text-tertiary)]">
                                                            {format(new Date(app.appliedDate), 'MMM dd, yyyy')}
                                                        </p>
                                                    )}
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                                        className="mt-2 w-full px-2 py-1 text-xs bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {STATUS_COLUMNS.map(col => (
                                                            <option key={col.id} value={col.id}>{col.title}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Add Application Form Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[var(--color-bg-primary)] rounded-2xl p-6 max-w-md w-full"
                            >
                                <h3 className="heading-3 mb-4">Add Job Application</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="body-small font-medium mb-2 block">Job Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.jobTitle}
                                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                            className="w-full px-4 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="body-small font-medium mb-2 block">Company</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full px-4 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="body-small font-medium mb-2 block">Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="body-small font-medium mb-2 block">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg"
                                        >
                                            {STATUS_COLUMNS.map(col => (
                                                <option key={col.id} value={col.id}>{col.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button type="submit" className="flex-1">Add Application</Button>
                                        <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
