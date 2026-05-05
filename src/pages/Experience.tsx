import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import BackgroundScene from '../components/ui/BackgroundScene'
import AnimatedText from '../components/ui/AnimatedText'


interface Experience {
  recipientName: string
  message: string
  theme: string
  audioUrl?: string
  scheduledAt: string
}

export default function Experience() {
  const { id } = useParams()
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  //const [audio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await axios.get(`/api/experience/${id}`)
        setExperience(response.data)
        
        // Auto-play audio if exists
        if (response.data.audioUrl) {
          const audioElement = new Audio(response.data.audioUrl)
          audioElement.play().catch(e => console.log('Auto-play prevented:', e))
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message || 'Experience not found')
      } finally {
        setLoading(false)
      }
    }

    fetchExperience()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-rose-50">
        <div className="text-2xl text-gray-600">Loading your surprise...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-rose-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <div className="text-xl text-gray-600">{error}</div>
        </div>
      </div>
    )
  }

  if (!experience) return null

  // Check if it's time to show
  const scheduledTime = new Date(experience.scheduledAt)
  const now = new Date()
  const isAvailable = now >= scheduledTime

  if (!isAvailable) {
    const timeUntil = scheduledTime.getTime() - now.getTime()
    const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60))
    const minutesUntil = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60))

    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-rose-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-semibold mb-2">Coming Soon!</h2>
          <p className="text-gray-600">
            This morning surprise will be available in {hoursUntil}h {minutesUntil}m
          </p>
        </div>
      </div>
    )
  }

  return (
    <BackgroundScene theme={experience.theme}>
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="max-w-2xl w-full text-center">
          <AnimatedText
            text={`Good morning, ${experience.recipientName}!`}
            className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-xl"
          >
            <p className="text-xl md:text-2xl text-white leading-relaxed">
              {experience.message}
            </p>
          </motion.div>

          {experience.audioUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <audio controls autoPlay className="mx-auto">
                <source src={experience.audioUrl} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            </motion.div>
          )}
        </div>
      </div>
    </BackgroundScene>
  )
}