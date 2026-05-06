import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import StyledQRCode from "../components/ui/StyledQRCode";
import html2canvas from "html2canvas";
import {
  Copy,
  Check,
  Share2,
  QrCode,
  Heart,
  Sparkles,
  Clock,
  Link as LinkIcon,
  Camera,
  X,
  Download,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

export default function Success() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isQRExpanded, setIsQRExpanded] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const shareUrl = `${window.location.origin}/e/${id}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      "✨ I created a special morning surprise for you! 🌅\n\nScan the QR code or click the link to open your surprise:",
    );
    window.open(`https://wa.me/?text=${text}%0A${shareUrl}`, "_blank");
  };

  const shareAsImage = async () => {
    setIsSharing(true);
    try {
      const element = document.getElementById("qr-card");
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: null,
          logging: false,
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `sunrise-surprise-${id}.png`;
        link.href = image;
        link.click();
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadQRCode = async () => {
    try {
      // Try to get the image from StyledQRCode component first
      const qrContainer = document.querySelector('.styled-qr-image') as HTMLImageElement;
      const dataUrl = qrContainer?.src || qrDataUrl;
      
      if (dataUrl) {
        const link = document.createElement("a");
        link.download = `sunrise-qr-${id}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("No QR code data available for download");
      }
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const handleQRGenerated = (dataUrl: string) => {
    setQrDataUrl(dataUrl);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
        role="main"
        aria-label="Success - Morning surprise created"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-purple-200"
          aria-label="Go back to home page"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Home
        </button>

        {/* Success Card */}
        <div
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20"
          role="status"
          aria-live="polite"
        >
          {/* Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-center"
          >
            <div className="flex justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Sparkles className="w-12 h-12 text-yellow-400" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Heart className="w-12 h-12 text-pink-400 fill-pink-400" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Sparkles className="w-12 h-12 text-yellow-400" />
              </motion.div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Morning Surprise Created!
            </h2>
            <p className="text-purple-200 mb-6">
              Your beautiful morning experience has been created. Share it with
              your special person:
            </p>
          </motion.div>

          {/* QR Code Toggle Button */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={() => setShowQR((prev) => !prev)}
              aria-expanded={showQR}
              aria-controls={showQR ? "qr-card" : undefined}
              aria-label={showQR ? "Hide QR code" : "Show QR code"}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-purple-200"
            >
              {showQR ? (
                <>
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                  Hide QR Code
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  Show QR Code
                </>
              )}
            </button>
          </div>

          {/* QR Code Card */}
          {showQR && (
            <motion.div
              id="qr-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-linear-to-br from-white/5 to-purple-500/10 rounded-xl p-6 mb-6 border border-white/10"
            >
                <div id="qr-image-container">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <QrCode className="w-5 h-5 text-purple-300" />
                      <h3 className="text-lg font-semibold text-white">
                        Scan to Open Surprise
                      </h3>
                    </div>
                    <p className="text-purple-300 text-sm">
                      Share this QR code with your loved one
                    </p>
                  </div>

                  <div className="flex justify-center relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <StyledQRCode
                        value={shareUrl}
                        size={isQRExpanded ? 500 : 400}
                        gradientColors={["#8b5cf6", "#ec4899"]}
                        frame={true}
                        frameColor="#ffffff"
                        onDownload={handleQRGenerated}
                      />
                    </motion.div>

                    {/* Expand/Contract Button */}
                    <button
                      type="button"
                      onClick={() => setIsQRExpanded(!isQRExpanded)}
                      aria-label={
                        isQRExpanded ? "Collapse QR code" : "Expand QR code"
                      }
                      className="absolute -top-2 -right-2 p-1 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
                    >
                      {isQRExpanded ? (
                        <X className="w-4 h-4 text-white" aria-hidden="true" />
                      ) : (
                        <Download
                          className="w-4 h-4 text-white"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>

                  {/* Download QR Button */}
                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      onClick={downloadQRCode}
                      aria-label="Download QR code as PNG image"
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-purple-200 transition-all"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      Download QR Code
                    </button>
                  </div>
                 </div>
              </motion.div>
            )}
         

          {/* Link Section */}
          <div className="bg-black/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <LinkIcon className="w-4 h-4 text-purple-300 shrink-0" />
                <code className="text-sm text-purple-200 break-all flex-1 font-mono">
                  {shareUrl}
                </code>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                aria-label={
                  copied ? "Link copied to clipboard" : "Copy link to clipboard"
                }
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>Copy Link</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={shareOnWhatsApp}
              aria-label="Share this morning surprise on WhatsApp"
              className="w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <Share2
                className="w-5 h-5 group-hover:rotate-12 transition-transform"
                aria-hidden="true"
              />
              Share on WhatsApp
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={shareAsImage}
              disabled={isSharing}
              aria-label={
                isSharing
                  ? "Generating image, please wait"
                  : "Download QR code as image"
              }
              className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              {isSharing ? (
                <>
                  <div
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                    aria-hidden="true"
                  ></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Camera
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <span>Share as Image</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-6 text-purple-300 text-sm">
            <Clock className="w-4 h-4" />
            <p>The link will become active at your scheduled time</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
