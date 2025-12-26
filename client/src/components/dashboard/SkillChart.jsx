import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function SkillChart({ skills = [] }) {
    // Transform skills data for radar chart
    const chartData = skills.slice(0, 8).map(skill => ({
        subject: skill.name.length > 10 ? skill.name.slice(0, 10) + '...' : skill.name,
        value: skill.level,
        fullMark: 100
    }));

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                No skills added yet
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-64"
        >
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <Radar
                        name="Skill Level"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.4}
                        strokeWidth={2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
