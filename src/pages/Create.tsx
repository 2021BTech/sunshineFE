import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeCard from '../components/ui/ThemeCard';
import VoiceRecorder from '../components/ui/VoiceRecorder';
import MessagePreview from '../components/ui/MessagePreview';
import FloatingParticles from '../components/ui/FloatingParticles';
import { experienceService } from '../services/experience';
import type { CreateExperienceData } from '../types/experience';
import { THEMES } from '../constants/themes';
import { AlertCircle } from 'lucide-react';


export default function Create() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateExperienceData>({
    recipientName: '',
    message: '',
    theme: 'romantic',
    scheduledAt: ''
  });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await experienceService.create({
        recipientName: formData.recipientName,
        message: formData.message,
        theme: formData.theme,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        audioUrl: audioUrl || null
      });
      navigate(`/success/${response.id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-2 text-white">Create Your Morning Surprise</h2>
                <p className="text-purple-200 mb-6">Fill in the details to create a magical experience</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                     <label htmlFor="recipient-name" className="block text-sm font-medium text-purple-200 mb-2">
                       Recipient's Name *
                     </label>
                     <input
                       id="recipient-name"
                       type="text"
                       required
                       value={formData.recipientName}
                       onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                       className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                       placeholder="e.g., Sarah"
                       aria-describedby={error ? "form-error" : undefined}
                     />
                   </div>

                  <div>
                     <label htmlFor="message" className="block text-sm font-medium text-purple-200 mb-2">
                       Your Message *
                     </label>
                     <textarea
                       id="message"
                       required
                       rows={4}
                       value={formData.message}
                       onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                       className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                       placeholder="Write something beautiful..."
                       aria-describedby={error ? "form-error" : undefined}
                     />
                   </div>

                  <div>
                     <label className="block text-sm font-medium text-purple-200 mb-3">
                       Choose Theme *
                     </label>
                      <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Theme selection">
                        {THEMES.map((theme) => (
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
                     <label htmlFor="schedule" className="block text-sm font-medium text-purple-200 mb-2">
                       Schedule Delivery *
                     </label>
                     <input
                       id="schedule"
                       type="datetime-local"
                       required
                       min={minDateTime}
                       value={formData.scheduledAt}
                       onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                       className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                       aria-describedby={error ? "form-error" : undefined}
                     />
                   </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Voice Note (Optional)
                    </label>
                    <VoiceRecorder onAudioUpload={setAudioUrl} />
                  </div>

                  {error && (
                    <div id="form-error" role="alert" className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label={isSubmitting ? "Creating your morning surprise, please wait" : "Create morning surprise"}
                    className="w-full px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
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
  );
}