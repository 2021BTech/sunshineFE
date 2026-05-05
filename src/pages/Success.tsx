import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Success() {
  const { id } = useParams()
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/e/${id}`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent("I created a special morning surprise for you! 🌅")
    window.open(`https://wa.me/?text=${text}%20${shareUrl}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Morning Surprise Created!</h2>
        <p className="text-gray-600 mb-6">
          Your beautiful morning experience has been created. Share this link with your special person:
        </p>

        <div className="bg-gray-100 p-3 rounded-lg mb-4 break-all">
          <code className="text-sm text-gray-700">{shareUrl}</code>
        </div>

        <div className="space-y-3">
          <button
            onClick={copyToClipboard}
            className="w-full btn-primary"
          >
            {copied ? 'Copied! ✓' : 'Copy Link'}
          </button>
          
          <button
            onClick={shareOnWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Share on WhatsApp 📱
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          The link will become active at your scheduled time
        </p>
      </motion.div>
    </div>
  )
}