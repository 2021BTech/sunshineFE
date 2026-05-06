import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface StyledQRCodeProps {
  value: string;
  size?: number;
  gradientColors?: string[];
  frame?: boolean;
  frameColor?: string;
  onDownload?: (dataUrl: string) => void;
}

export default function StyledQRCode({
  value,
  size = 300,
  gradientColors = ['#8b5cf6', '#ec4899'],
  frame = true,
  frameColor = '#ffffff',
  onDownload
}: StyledQRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const generateQR = async () => {
      setIsGenerating(true);
      try {
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: gradientColors[0] || '#8b5cf6',
            light: '#ffffff',
          },
        });

        if (!isMounted) return;

        setQrDataUrl(dataUrl);

        if (onDownload) {
          onDownload(dataUrl);
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    };

    generateQR();

    return () => {
      isMounted = false;
    };
  }, [value, size, gradientColors, onDownload]);

  const handleDownload = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.download = `sunrise-qr-${Date.now()}.png`;
      link.href = qrDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isGenerating) {
    return (
      <div className="qr-loader-container flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="styled-qr-container flex flex-col items-center gap-4"
    >
      <div className="styled-qr-wrapper relative group">
        <div className="relative inline-block">
          <img
            src={qrDataUrl}
            alt="QR Code"
            className="rounded-2xl shadow-2xl transition-transform duration-300"
            style={{ width: size, height: size, border: frame ? `10px solid ${frameColor}` : 'none' }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
            <button
               type="button"
               onClick={handleDownload}
               aria-label="Download QR code"
               className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors"
             >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}