import { motion } from 'framer-motion'

interface BackgroundSceneProps {
  theme: string
  preview?: boolean
  children?: React.ReactNode
}

export default function BackgroundScene({ theme, preview = false, children }: BackgroundSceneProps) {
  const getBackground = () => {
    switch (theme) {
      case 'romantic':
        return {
          gradient: 'bg-gradient-to-br from-pink-400 via-red-400 to-rose-600',
          pattern: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]',
          overlay: 'bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 5 L35 20 L50 20 L38 30 L42 45 L30 35 L18 45 L22 30 L10 20 L25 20 Z" fill="rgba(255,255,255,0.05)" fill-rule="evenodd"/%3E%3C/svg%3E")]'
        }
      case 'calm':
        return {
          gradient: 'bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-600',
          pattern: 'bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))]',
          overlay: 'bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 10 L40 10 L50 30 L40 50 L20 50 L10 30 Z" fill="rgba(255,255,255,0.05)" fill-rule="evenodd"/%3E%3C/svg%3E")]'
        }
      case 'playful':
        return {
          gradient: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-600',
          pattern: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]',
          overlay: 'bg-[url("data:image/svg+xml,%3Csvg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="26" cy="26" r="10" fill="rgba(255,255,255,0.05)"/%3E%3C/svg%3E")]'
        }
      default:
        return {
          gradient: 'bg-gradient-to-br from-purple-600 to-pink-600',
          pattern: '',
          overlay: ''
        }
    }
  }

  const background = getBackground()

  if (preview) {
    return (
      <div className={`absolute inset-0 ${background.gradient} ${background.pattern} ${background.overlay}`}>
        <div className="absolute inset-0 bg-black/20" />
      </div>
    )
  }

  return (
    <div className={`relative min-h-screen ${background.gradient} ${background.pattern} ${background.overlay} overflow-hidden`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
      </motion.div>
      {children}
    </div>
  )
}