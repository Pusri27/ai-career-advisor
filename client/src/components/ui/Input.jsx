export default function Input({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block body-small font-medium mb-2 text-[var(--color-text-primary)]">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    className={`clean-input ${Icon ? 'pl-10' : ''} ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_var(--color-error-light)]' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="body-small text-[var(--color-error)] mt-1.5">
                    {error}
                </p>
            )}
        </div>
    );
}

export function Textarea({
    label,
    error,
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block body-small font-medium mb-2 text-[var(--color-text-primary)]">
                    {label}
                </label>
            )}
            <textarea
                className={`clean-input resize-none ${error ? 'border-[var(--color-error)]' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="body-small text-[var(--color-error)] mt-1.5">
                    {error}
                </p>
            )}
        </div>
    );
}

export function Select({
    label,
    error,
    options = [],
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block body-small font-medium mb-2 text-[var(--color-text-primary)]">
                    {label}
                </label>
            )}
            <select
                className={`clean-input ${error ? 'border-[var(--color-error)]' : ''} ${className}`}
                {...props}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="body-small text-[var(--color-error)] mt-1.5">
                    {error}
                </p>
            )}
        </div>
    );
}
