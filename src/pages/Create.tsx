import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeCard from '../components/ui/ThemeCard';
import VoiceRecorder from '../components/ui/VoiceRecorder';
import MessagePreview from '../components/ui/MessagePreview';
import FloatingParticles from '../components/ui/FloatingParticles';
import { experienceService } from '../services/experience';
import type { CreateExperienceData } from '../types/experience';
import { THEMES, GREETINGS } from '../constants/themes';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function Create() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateExperienceData>({
    recipientName: '',
    message: '',
    theme: 'romantic',
    greeting: 'Hello',
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
        greeting: formData.greeting,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        audioUrl: audioUrl || null
      });
      navigate(`/success/${response.id}`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingParticles theme={formData.theme} />
      
      <div className="relative z-10 py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-6xl w-full"
            role="main"
            aria-label="Create surprise"
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-purple-200"
              aria-label="Go back to home page"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Home
            </button>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="p-6 sm:p-8">
                  <h2 className="text-3xl font-bold mb-2 text-white">Create Your Surprise</h2>
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3" role="radiogroup" aria-label="Theme selection">
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
                      <label className="block text-sm font-medium text-purple-200 mb-3">
                        Greeting (Optional)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2" role="radiogroup" aria-label="Greeting selection">
                        {GREETINGS.map((greeting) => (
                          <button
                            type="button"
                            key={greeting.value}
                            role="radio"
                            onClick={() => setFormData({ ...formData, greeting: greeting.value })}
                            aria-checked={formData.greeting === greeting.value}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              formData.greeting === greeting.value
                                ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'bg-white/10 hover:bg-white/20 text-purple-200'
                            }`}
                          >
                            {greeting.label}
                          </button>
                        ))}
                      </div>
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
                      aria-label={isSubmitting ? "Creating your surprise, please wait" : "Create surprise"}
                      className="w-full px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Surprise ✨'}
                    </button>
                  </form>
                </div>

                <div className="bg-linear-to-br from-white/5 to-transparent p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Live Preview</h3>
                  <MessagePreview
                    recipientName={formData.recipientName || 'Name'}
                    message={formData.message || 'Your message will appear here...'}
                    theme={formData.theme}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
