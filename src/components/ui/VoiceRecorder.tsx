import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { uploadService } from '../../services/upload';
import { Mic, Square, Trash2, Loader2, AlertCircle, Upload, FileAudio } from 'lucide-react';
import type { VoiceRecorderProps } from '../../types/upload';


export default function VoiceRecorder({ 
  onAudioUpload, 
  maxDuration = 300 // Default 5 minutes
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setError(null);
    setRecordingDuration(0);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        // Clear duration interval
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
        
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Convert Blob to File for upload
        const audioFile = new File([blob], `recording-${Date.now()}.webm`, { 
          type: 'audio/webm',
          lastModified: Date.now()
        });
        
        // Upload using centralized service
        setUploading(true);
        try {
          const response = await uploadService.uploadAudio(audioFile);
          onAudioUpload(response.url);
        } catch (err) {
          console.error('Upload failed:', err);
          setError('Failed to upload audio. Please check your connection and try again.');
        } finally {
          setUploading(false);
        }
      };

      // Start recording with time slices
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      
      // Track recording duration
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (err) {
      console.error('Microphone access denied:', err);
      setError('Microphone access is required to record voice notes. Please allow microphone access and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const deleteRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      onAudioUpload('');
    }
    chunksRef.current = [];
    setError(null);
    setRecordingDuration(0);
    setShowUpload(false);
  }, [audioUrl, onAudioUpload]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      setError('Please upload a valid audio file (MP3, WAV, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    // Upload file
    setUploading(true);
    try {
      const response = await uploadService.uploadAudio(file);
      onAudioUpload(response.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload audio. Please check your connection and try again.');
      URL.revokeObjectURL(url);
      setAudioUrl(null);
    } finally {
      setUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-recorder space-y-3">
      {!audioUrl ? (
        <div className="recording-controls space-y-2">
           {!showUpload ? (
             <>
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 type="button"
                 onClick={isRecording ? stopRecording : startRecording}
                 disabled={uploading}
                 aria-label={isRecording ? `Stop recording (${formatDuration(recordingDuration)})` : "Start voice recording"}
                 aria-pressed={isRecording}
                 className={`voice-recorder-btn w-full px-4 py-2 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                   isRecording
                     ? 'recording-btn bg-red-500 hover:bg-red-600 text-white'
                     : 'record-btn bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                 } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 {isRecording ? (
                   <>
                     <Square className="w-4 h-4" aria-hidden="true" />
                     Stop Recording ({formatDuration(recordingDuration)})
                   </>
                 ) : (
                   <>
                     <Mic className="w-4 h-4" aria-hidden="true" />
                     Start Recording
                   </>
                 )}
               </motion.button>

               {isRecording && (
                 <div className="recording-indicator flex items-center justify-center gap-2 text-sm text-purple-200" role="status" aria-live="polite">
                   <div className="recording-dot w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true" />
                   <span>Recording in progress... {formatDuration(recordingDuration)}</span>
                 </div>
               )}

               <div className="text-center">
                 <span className="text-purple-300 text-sm">or</span>
               </div>

               <button
                 type="button"
                 onClick={() => setShowUpload(true)}
                 disabled={uploading || isRecording}
                 className="w-full px-4 py-2 rounded-full font-semibold bg-white/10 hover:bg-white/20 text-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <Upload className="w-4 h-4" aria-hidden="true" />
                 Upload Audio File
               </button>
             </>
           ) : (
             <>
               <input
                 ref={fileInputRef}
                 type="file"
                 accept="audio/*"
                 onChange={handleFileUpload}
                 className="hidden"
                 id="audio-upload"
               />
               <label
                 htmlFor="audio-upload"
                 className="w-full px-4 py-8 rounded-lg border-2 border-dashed border-purple-400/50 hover:border-purple-400 transition-all flex flex-col items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10"
               >
                 <FileAudio className="w-8 h-8 text-purple-300" aria-hidden="true" />
                 <span className="text-purple-200 text-sm font-medium">Click to upload audio file</span>
                 <span className="text-purple-400 text-xs">MP3, WAV, M4A, etc. (max 10MB)</span>
               </label>

               <button
                 type="button"
                 onClick={() => setShowUpload(false)}
                 disabled={uploading}
                 className="w-full px-4 py-2 rounded-full font-semibold bg-white/10 hover:bg-white/20 text-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Back to Recording
               </button>
             </>
           )}
         </div>
       ) : (
        <div className="recording-preview space-y-2">
          <audio controls src={audioUrl} className="w-full rounded-lg audio-player" />
          <div className="flex gap-2 items-center justify-between">
            <button
              type="button"
              onClick={deleteRecording}
              disabled={uploading}
              className="delete-btn px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
            
            {uploading && (
              <span className="uploading-status text-sm text-purple-200 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Uploading audio...
              </span>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-message text-red-400 text-sm bg-red-400/10 p-3 rounded-lg flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}