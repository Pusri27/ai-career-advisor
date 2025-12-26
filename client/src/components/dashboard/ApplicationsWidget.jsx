import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { useEffect, useState } from 'react';
import { useRefresh } from '../../context/RefreshContext';
import applicationsAPI from '../../services/applications.api';

export default function ApplicationsWidget() {
    const { refreshTriggers } = useRefresh();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [refreshTriggers.applications]);

    const fetchData = async () => {
        try {
            const [appsRes, statsRes] = await Promise.all([
                applicationsAPI.getAll(),
                applicationsAPI.getStats()
            ]);
            setData({
                applications: appsRes.data.data.slice(0, 3), // Latest 3
                stats: statsRes.data.data
            });
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Job Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-3">
                        <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const statusColors = {
        saved: 'bg-gray-500',
        applied: 'bg-blue-500',
        interview: 'bg-yellow-500',
        offer: 'bg-green-500',
        rejected: 'bg-red-500',
        accepted: 'bg-purple-500'
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Job Applications</CardTitle>
                    <Link to="/applications">
                        <Button variant="secondary" size="sm">View All</Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-[var(--color-bg-tertiary)] rounded">
                        <p className="heading-4">{data?.stats?.total || 0}</p>
                        <p className="body-small text-[var(--color-text-tertiary)]">Total</p>
                    </div>
                    <div className="text-center p-2 bg-[var(--color-bg-tertiary)] rounded">
                        <p className="heading-4">{data?.stats?.byStatus?.interview || 0}</p>
                        <p className="body-small text-[var(--color-text-tertiary)]">Interviews</p>
                    </div>
                    <div className="text-center p-2 bg-[var(--color-bg-tertiary)] rounded">
                        <p className="heading-4">{data?.stats?.byStatus?.offer || 0}</p>
                        <p className="body-small text-[var(--color-text-tertiary)]">Offers</p>
                    </div>
                </div>

                {data?.applications?.length > 0 ? (
                    <div className="space-y-2">
                        <p className="body-small font-medium mb-2">Recent Applications</p>
                        {data.applications.map(app => (
                            <div key={app._id} className="p-2 bg-[var(--color-bg-tertiary)] rounded">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="body-small font-medium">{app.jobTitle}</p>
                                        <p className="body-small text-[var(--color-text-tertiary)]">{app.company}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs text-white ${statusColors[app.status]}`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-[var(--color-text-tertiary)] py-4 body-small">No applications yet</p>
                )}
            </CardContent>
        </Card>
    );
}
