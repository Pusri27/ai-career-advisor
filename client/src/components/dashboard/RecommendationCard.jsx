import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecommendationCard({
    title,
    description,
    icon: Icon,
    link,
    external = false,
    priority = null,
    actionText = 'Learn More'
}) {
    const content = (
        <motion.div
            whileHover={{ y: -2 }}
            className="clean-card-interactive p-4 h-full flex flex-col justify-between group bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)]"
        >
            <div className="flex items-start gap-3">
                {Icon && (
                    <div className="p-2.5 rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                            {title}
                        </h4>
                        {priority && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${priority === 'high' ? 'bg-rose-100 text-rose-600' :
                                    priority === 'low' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                {priority}
                            </span>
                        )}
                    </div>
                    <p className="body-small text-[var(--color-text-secondary)] line-clamp-2 leading-snug">
                        {description}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1 mt-3 pl-[3.25rem] text-xs font-semibold text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                {actionText}
                {external ? (
                    <ExternalLink className="w-3 h-3" />
                ) : (
                    <ArrowRight className="w-3 h-3" />
                )}
            </div>
        </motion.div>
    );

    if (external) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
                {content}
            </a>
        );
    }

    return <Link to={link} className="block h-full font-sans">{content}</Link>;
}
