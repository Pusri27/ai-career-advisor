export default function Skeleton({ className = '', variant = 'default' }) {
    const variants = {
        default: 'h-4 w-full',
        title: 'h-6 w-3/4',
        text: 'h-4 w-full',
        circle: 'h-12 w-12 rounded-full',
        card: 'h-32 w-full',
        avatar: 'h-10 w-10 rounded-full',
    };

    return (
        <div
            className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${variants[variant]} ${className}`}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="p-4 bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border-primary)]">
            <Skeleton variant="title" className="mb-2" />
            <Skeleton variant="text" className="mb-2" />
            <Skeleton variant="text" className="w-2/3" />
        </div>
    );
}

export function SkeletonGoal() {
    return (
        <div className="p-4 bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border-primary)]">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <Skeleton variant="title" className="mb-1 w-1/2" />
                    <Skeleton variant="text" className="w-2/3" />
                </div>
                <Skeleton className="h-6 w-12" />
            </div>
            <Skeleton className="h-2 w-full mb-3" />
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="h-64 flex items-end gap-2 px-4">
            {[...Array(7)].map((_, i) => (
                <Skeleton
                    key={i}
                    className="flex-1"
                    style={{ height: `${Math.random() * 100 + 50}px` }}
                />
            ))}
        </div>
    );
}
