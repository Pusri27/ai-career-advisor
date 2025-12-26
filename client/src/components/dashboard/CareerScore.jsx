import { motion } from 'framer-motion';

export default function CareerScore({ score = 0, size = 'lg' }) {
    const sizes = {
        sm: { container: 'w-24 h-24', text: 'text-2xl', label: 'text-xs' },
        md: { container: 'w-32 h-32', text: 'text-3xl', label: 'text-sm' },
        lg: { container: 'w-40 h-40', text: 'text-4xl', label: 'text-sm' }
    };

    const { container, text, label } = sizes[size];

    // Calculate stroke dasharray for circular progress
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const progress = ((100 - score) / 100) * circumference;

    // Color based on score
    const getColor = (score) => {
        if (score >= 80) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' };
        if (score >= 60) return { stroke: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' };
        if (score >= 40) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' };
        return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' };
    };

    const { stroke, glow } = getColor(score);

    return (
        <div className={`relative ${container} flex items-center justify-center`}>
            {/* Background glow */}
            <div
                className="absolute inset-0 rounded-full blur-xl opacity-50"
                style={{ backgroundColor: glow }}
            />

            {/* SVG Circle */}
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="8"
                />
                {/* Progress circle */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={stroke}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: progress }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                />
            </svg>

            {/* Score text */}
            <div className="relative text-center">
                <motion.span
                    className={`${text} font-bold text-white`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {score}
                </motion.span>
                <p className={`${label} text-slate-400 mt-1`}>Career Score</p>
            </div>
        </div>
    );
}
