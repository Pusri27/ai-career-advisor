import { Link } from 'react-router-dom';
import { TrendingUp, Target } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { useEffect, useState } from 'react';
import { useRefresh } from '../../context/RefreshContext';
import progressAPI from '../../services/progress.api';

export default function ProgressWidget() {
    const { refreshTriggers } = useRefresh();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [refreshTriggers.skills, refreshTriggers.goals]);

    const fetchData = async () => {
        try {
            const [analyticsRes, goalsRes] = await Promise.all([
                progressAPI.getAnalytics(),
                progressAPI.getGoals('active')
            ]);
            setData({
                analytics: analyticsRes.data.data,
                goals: goalsRes.data.data.slice(0, 3) // Top 3 goals
            });
        } catch (error) {
            console.error('Failed to fetch progress data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Progress Overview</CardTitle>
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

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Progress Overview</CardTitle>
                    <Link to="/progress">
                        <Button variant="secondary" size="sm">View All</Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-[var(--color-accent)]" />
                            <span className="body-small text-[var(--color-text-tertiary)]">Total Skills</span>
                        </div>
                        <p className="heading-3">{data?.analytics?.totalSkills || 0}</p>
                    </div>
                    <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-blue-500" />
                            <span className="body-small text-[var(--color-text-tertiary)]">Active Goals</span>
                        </div>
                        <p className="heading-3">{data?.analytics?.activeGoals || 0}</p>
                    </div>
                </div>

                {data?.goals?.length > 0 ? (
                    <div className="space-y-2">
                        <p className="body-small font-medium mb-2">Active Goals</p>
                        {data.goals.map(goal => (
                            <div key={goal._id} className="p-2 bg-[var(--color-bg-tertiary)] rounded">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="body-small">{goal.title}</span>
                                    <span className="body-small text-[var(--color-accent)]">{goal.progress}%</span>
                                </div>
                                <div className="w-full h-1 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--color-accent)] rounded-full transition-all"
                                        style={{ width: `${goal.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-[var(--color-text-tertiary)] py-4 body-small">No active goals</p>
                )}
            </CardContent>
        </Card>
    );
}
