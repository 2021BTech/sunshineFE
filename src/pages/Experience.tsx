import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundScene from "../components/ui/BackgroundScene";
import FloatingParticles from "../components/ui/FloatingParticles";
import AnimatedText from "../components/ui/AnimatedText";
import { experienceService } from "../services/experience";
import type { ExperienceData, ThemeType } from "../types/experience";
import { calculateTimeUntil, formatTimeUntil } from "../utils/time";

export default function Experience() {
  const { id } = useParams();
  const [experience, setExperience] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchExperience = async () => {
      try {
        const data = await experienceService.getById(id);
        setExperience(data);
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || "Experience not found");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);



  // Update current time every 30 seconds to refresh the countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000); 

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-rose-50">
        <div className="text-2xl text-gray-600">Loading your surprise...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-rose-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <div className="text-xl text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!experience) return null;

  // Check if it's time to show
  const scheduledTimestamp = new Date(experience.scheduledAt).getTime();
  const isAvailable = currentTime >= scheduledTimestamp;

  if (!isAvailable) {
    const timeUntil = calculateTimeUntil(new Date(scheduledTimestamp));

    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-rose-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-semibold mb-2">Coming Soon!</h2>
            <p className="text-gray-600">
              This surprise will be available in {formatTimeUntil(timeUntil)}
            </p>
          <p className="text-sm text-gray-500 mt-2">Page refreshes automatically</p>
        </div>
      </div>
    );
  }

  return (
    <BackgroundScene theme={experience.theme as ThemeType}>
      <FloatingParticles theme={experience.theme as ThemeType} />
      <main id="main-content" className="min-h-screen flex items-center justify-center px-4 py-8 relative z-10">
        <div className="max-w-3xl w-full text-center">
          <AnimatedText
            text={`Hello, ${experience.recipientName}!`}
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 md:mb-8 drop-shadow-lg"
            type="gradient"
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/20 relative overflow-hidden"
          >
            {/* Decorative quote marks */}
            <div className="absolute top-2 sm:top-4 left-4 sm:left-6 text-4xl sm:text-6xl text-white/10 font-serif">"</div>
            <div className="absolute bottom-2 sm:bottom-4 right-4 sm:right-6 text-4xl sm:text-6xl text-white/10 font-serif rotate-180">"</div>
            
            <AnimatedText
              text={experience.message}
              className="text-lg sm:text-xl md:text-3xl text-white leading-relaxed font-light italic"
              type="words"
              delay={0.8}
              once={false}
            />
          </motion.div>

          {experience.audioUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <audio
                ref={audioRef}
                controls
                className="mx-auto"
                aria-label="Voice message from your special person"
                onPlay={() => setAudioPlaying(true)}
                onPause={() => setAudioPlaying(false)}
              >
                <source src={experience.audioUrl} type="audio/mpeg" />
                <source src={experience.audioUrl} type="audio/webm" />
                <source src={experience.audioUrl} type="audio/mp4" />
                Your browser does not support the audio element.
              </audio>
              <p className="text-white/70 text-sm mt-2 text-center">
                {audioPlaying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Playing voice message...
                  </span>
                ) : (
                  "Click play to hear your voice message"
                )}
              </p>
            </motion.div>
          )}
         </div>
       </main>
     </BackgroundScene>
   );
 }
