import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import FloatingParticles from '../components/ui/FloatingParticles'


export default function Landing() {
  const navigate = useNavigate()
  const [, setMousePosition] = useState({ x: 0, y: 0 })
  //const controls = useAnimation()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.8])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: "🎙️",
      title: "Voice Notes",
      description: "Record a personal voice message that plays automatically when they wake up",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "🎨",
      title: "Beautiful Themes",
      description: "Choose from romantic, calm, or playful animated themes",
      color: "from-blue-500 to-cyan-500"
    },
      {
        icon: "⏰",
        title: "Schedule Delivery",
        description: "Set the perfect time for your surprise",
        color: "from-orange-500 to-yellow-500"
      },
      {
        icon: "🔗",
        title: "Shareable Links",
        description: "Create a unique link to share your surprise",
        color: "from-green-500 to-emerald-500"
      }
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      <FloatingParticles />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ left: '10%', top: '20%' }}
          
        />
        <motion.div
          className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ right: '10%', bottom: '20%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ left: '30%', bottom: '10%' }}
        />
      </div>

      {/* Hero Section */}
      <motion.div 
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center px-4"
      >
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6 bg-linear-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% auto' }}
            >
              Sunrise
            </motion.h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-purple-100 mb-4 max-w-2xl mx-auto"
          >
            Be the best part of their day
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-purple-200 mb-12 max-w-2xl mx-auto"
          >
            Create a magical experience for someone special with a personalized message, 
            voice note, and beautiful animations that will make their day unforgettable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168,85,247,0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create')}
              className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 text-lg"
            >
              Create Surprise ✨
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 text-lg"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div id="features" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Make Every Morning Special
            </h2>
            <p className="text-xl text-purple-200">
              Create unforgettable moments with these amazing features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:border-purple-400 transition-all duration-300"
              >
                <motion.div 
                  className="text-5xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-purple-200">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-linear-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
               Ready to Make Their Day?
            </h2>
            <p className="text-xl text-purple-200 mb-8">
              Create a beautiful surprise that they'll remember forever
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create')}
              className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 text-lg"
            >
               Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}