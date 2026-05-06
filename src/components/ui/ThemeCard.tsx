import { motion } from 'framer-motion';
import type { ThemeCardProps, ThemeType } from '../../types/experience';
export interface ThemeOption {
  id: ThemeType;
  name: string;
  icon: string;
  color: string;
}

export default function ThemeCard({ theme, selected, onSelect }: ThemeCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Select ${theme.name} theme`}
      className={`p-3 sm:p-4 rounded-xl transition-all duration-200 ${
        selected
          ? `bg-linear-to-br ${theme.color} text-white shadow-lg shadow-purple-500/30`
          : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
      }`}
    >
      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2" aria-hidden="true">{theme.icon}</div>
      <div className="text-sm sm:text-base font-semibold">{theme.name}</div>
      {selected && (
        <div className="text-xs mt-1 opacity-90" aria-live="polite">Selected</div>
      )}
    </motion.button>
  );
}