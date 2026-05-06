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
          gradient: 'bg-linear-to-br from-pink-900 via-rose-800 to-red-900',
          particles: 'from-pink-400 to-rose-400'
        }
      case 'calm':
        return {
          gradient: 'bg-linear-to-br from-blue-900 via-cyan-800 to-teal-900',
          particles: 'from-blue-400 to-cyan-400'
        }
      case 'playful':
        return {
          gradient: 'bg-linear-to-br from-yellow-900 via-orange-800 to-red-900',
          particles: 'from-yellow-400 to-orange-400'
        }
      default:
        return {
          gradient: 'bg-linear-to-br from-slate-900 via-purple-900 to-slate-900',
          particles: 'from-purple-400 to-pink-400'
        }
    }
  }

  const background = getBackground()

  if (preview) {
    return (
      <div className={`absolute inset-0 ${background.gradient}`}>
        <div className="absolute inset-0 bg-black/20" />
      </div>
    )
  }

  return (
    <div className={`relative min-h-screen ${background.gradient} overflow-hidden`}>
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 bg-linear-to-r ${background.particles} rounded-full opacity-20`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* Gradient overlay */}
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