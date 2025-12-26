export default function Button({
    children,
    variant = 'primary', // 'primary' | 'secondary' | 'ghost'
    size = 'md', // 'sm' | 'md' | 'lg'
    icon: Icon,
    iconPosition = 'left',
    className = '',
    disabled = false,
    loading = false,
    ...props
}) {
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost'
    };

    const sizeClasses = {
        sm: 'text-sm py-2 px-3',
        md: 'text-sm py-2.5 px-5',
        lg: 'text-base py-3 px-6'
    };

    const baseClass = variantClasses[variant] || variantClasses.primary;
    const sizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        <button
            className={`${baseClass} ${sizeClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
            {loading ? 'Loading...' : children}
            {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </button>
    );
}
