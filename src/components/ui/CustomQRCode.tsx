import { useEffect, useRef, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import styles from './CustomQRCode.module.css';

interface CustomQRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  logo?: string;
  download?: boolean;
}

export default function CustomQRCode({ 
  value, 
  size = 300, 
  bgColor = '#ffffff',
  fgColor = '#8b5cf6',
  logo,
  download = false
}: CustomQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const generateQRCode = useCallback(async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = size;
      canvas.height = size;

      await QRCode.toCanvas(canvas, value, {
        width: size,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        margin: 2,
        errorCorrectionLevel: 'H',
      });

      const ctx = canvas.getContext('2d');
      if (ctx && logo) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const logoSize = size * 0.2;
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;
          
          ctx.fillStyle = bgColor;
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
          ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
          setQrDataUrl(canvas.toDataURL());
        };
        img.src = logo;
      } else {
        setQrDataUrl(canvas.toDataURL());
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }, [value, size, bgColor, fgColor, logo]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  const handleDownload = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.download = `sunrise-qr-${Date.now()}.png`;
      link.href = qrDataUrl;
      link.click();
    }
  };

  return (
    <div 
      className={styles.wrapper}
      style={{ '--qr-size': `${size}px` } as React.CSSProperties}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.container}
      >
        <canvas ref={canvasRef} className={styles.hiddenCanvas} />
        {qrDataUrl && (
          <img 
            src={qrDataUrl} 
            alt="QR Code" 
            className={styles.image}
          />
        )}
      </motion.div>
      
      {download && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className={styles.downloadButton}
        >
          <Download className="w-5 h-5" />
          Download QR Code
        </motion.button>
      )}
    </div>
  );
}