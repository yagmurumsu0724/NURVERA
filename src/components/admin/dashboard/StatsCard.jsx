import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatsCard({ title, value, change, changeType, icon: Icon, color }) {
  const colorMap = {
    green: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    gold: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-gradient-to-br bg-slate-900 border rounded-xl p-6 backdrop-blur-sm border-slate-800 flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mt-2 font-mono"
          >
            {value}
          </motion.p>
        </div>
        <div className={`p-3 rounded-xl bg-slate-800 border border-slate-700/50 ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          {changeType === 'up' ? (
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          ) : changeType === 'down' ? (
            <TrendingDown className="w-4 h-4 text-red-400" />
          ) : (
            <Minus className="w-4 h-4 text-slate-400" />
          )}
          <span className={`font-semibold ${
            changeType === 'up' ? 'text-emerald-400' :
            changeType === 'down' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {changeType === 'up' ? '+' : ''}{change}%
          </span>
          <span className="text-slate-500">geçen aya göre</span>
        </div>
      )}
    </motion.div>
  );
}
