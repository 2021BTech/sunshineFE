import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import ThemeCard from '../components/ui/ThemeCard'
import VoiceRecorder from '../components/ui/VoiceRecorder'
import MessagePreview from '../components/ui/MessagePreview'
import FloatingParticles from '../components/ui/FloatingParticles'

export default function Create() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    recipientName: '',
    message: '',
    theme: 'romantic',
    scheduledAt: ''
  })
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const themes = [
    { id: 'romantic', name: 'Romantic', icon: '❤️', color: 'from-pink-400 to-rose-400' },
    { id: 'calm', name: 'Calm', icon: '🌊', color: 'from-blue-400 to-cyan-400' },
    { id: 'playful', name: 'Playful', icon: '🎉', color: 'from-yellow-400 to-orange-400' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await axios.post('/api/experience', {
        ...formData,
        audioUrl
      })
      navigate(`/success/${response.data.id}`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const minDateTime = new Date().toISOString().slice(0, 16)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-gradient rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-2 text-white">Create Your Morning Surprise</h2>
                <p className="text-purple-200 mb-6">Fill in the details to create a magical experience</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Recipient's Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Sarah"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Write something beautiful..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-3">
                      Choose Theme *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {themes.map((theme) => (
                        <ThemeCard
                          key={theme.id}
                          theme={theme}
                          selected={formData.theme === theme.id}
                          onSelect={() => setFormData({ ...formData, theme: theme.id })}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Schedule Delivery *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      min={minDateTime}
                      value={formData.scheduledAt}
                      aria-label="Schedule Date and Time"
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Voice Note (Optional)
                    </label>
                    <VoiceRecorder onAudioUpload={setAudioUrl} />
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Morning Surprise ✨'}
                  </button>
                </form>
              </div>

              {/* Preview Section */}
              <div className="bg-linear-to-br from-white/5 to-transparent p-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Live Preview</h3>
                <MessagePreview
                  recipientName={formData.recipientName || 'Name'}
                  message={formData.message || 'Your message will appear here...'}
                  theme={formData.theme}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}