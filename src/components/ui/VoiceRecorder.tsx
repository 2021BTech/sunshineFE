import { useState, useRef } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

interface VoiceRecorderProps {
  onAudioUpload: (url: string) => void
}

export default function VoiceRecorder({ onAudioUpload }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        setUploading(true)
        const formData = new FormData()
        formData.append('audio', blob, 'recording.webm')
        
        try {
          const response = await axios.post('/api/upload/audio', formData)
          onAudioUpload(response.data.url)
        } catch (error) {
          console.error('Upload failed:', error)
        } finally {
          setUploading(false)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Microphone access denied:', err)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop())
  }

  const deleteRecording = () => {
    setAudioUrl(null)
    onAudioUpload('')
  }

  return (
    <div className="space-y-3">
      {!audioUrl ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-full font-semibold transition-all ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
          }`}
        >
          {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
        </motion.button>
      ) : (
        <div className="space-y-2">
          <audio controls src={audioUrl} className="w-full rounded-lg" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={deleteRecording}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-all"
            >
              Delete
            </button>
            {uploading && <span className="text-sm text-purple-200">Uploading...</span>}
          </div>
        </div>
      )}
    </div>
  )
}