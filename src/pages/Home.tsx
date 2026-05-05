import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">
            Sunrise
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4">
            Be the best part of their morning
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Create a magical morning experience for someone special with a personalized message, 
            voice note, and beautiful animations.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="btn-primary text-lg"
          >
            Create Morning Surprise ✨
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: "🎙️",
    title: "Voice Notes",
    description: "Record a personal voice message to wake them up with your voice"
  },
  {
    icon: "🎨",
    title: "Beautiful Themes",
    description: "Choose from romantic, calm, or playful themes"
  },
  {
    icon: "🔗",
    title: "Shareable Links",
    description: "Create a unique link to share your morning surprise"
  }
]