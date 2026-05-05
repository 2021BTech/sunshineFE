import { motion } from 'framer-motion'

interface ThemeCardProps {
  theme: {
    id: string
    name: string
    icon: string
    color: string
  }
  selected: boolean
  onSelect: () => void
}

export default function ThemeCard({ theme, selected, onSelect }: ThemeCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={`p-4 rounded-xl transition-all duration-200 ${
        selected
          ? `bg-linear-to-br ${theme.color} text-white shadow-lg shadow-purple-500/30`
          : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
      }`}
    >
      <div className="text-3xl mb-2">{theme.icon}</div>
      <div className="font-semibold">{theme.name}</div>
    </motion.button>
  )
}