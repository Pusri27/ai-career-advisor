export default function Card({
    children,
    className = '',
    variant = 'default', // 'default' | 'interactive'
    ...props
}) {
    const baseClasses = variant === 'interactive'
        ? 'clean-card-interactive'
        : 'clean-card';

    return (
        <div
            className={`${baseClasses} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`heading-4 ${className}`}>
            {children}
        </h3>
    );
}

export function CardDescription({ children, className = '' }) {
    return (
        <p className={`body-small mt-1 ${className}`}>
            {children}
        </p>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={`mt-4 pt-4 border-t border-[var(--color-border-primary)] ${className}`}>
            {children}
        </div>
    );
}
