import { useEffect, useRef } from 'react';
import type { ThemeType } from '../../types/experience';

interface FloatingParticlesProps {
  theme?: ThemeType;
}

type AnimationType = 'float' | 'sparkle' | 'wave' | 'spiral' | 'bounce';

export default function FloatingParticles({ theme = 'romantic' }: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Theme-specific configurations
    const themeConfig: Record<ThemeType, {
      colors: string[];
      count: number;
      sizeRange: [number, number];
      speed: number;
      animationType: AnimationType;
      opacityRange: [number, number];
    }> = {
      romantic: {
        colors: ['255, 105, 180', '255, 20, 147', '255, 182, 193', '255, 192, 203'],
        count: 50,
        sizeRange: [3, 8],
        speed: 0.4,
        animationType: 'float',
        opacityRange: [0.3, 0.8]
      },
      calm: {
        colors: ['173, 216, 230', '135, 206, 250', '176, 224, 230', '135, 206, 235'],
        count: 40,
        sizeRange: [4, 12],
        speed: 0.3,
        animationType: 'wave',
        opacityRange: [0.2, 0.6]
      },
      playful: {
        colors: ['255, 255, 0', '255, 165, 0', '255, 69, 0', '50, 205, 50', '138, 43, 226'],
        count: 80,
        sizeRange: [3, 7],
        speed: 1.2,
        animationType: 'spiral',
        opacityRange: [0.4, 0.9]
      },
      birthday: {
        colors: ['147, 112, 219', '219, 112, 147', '255, 215, 0', '255, 182, 193'],
        count: 60,
        sizeRange: [2, 6],
        speed: 0.5,
        animationType: 'sparkle',
        opacityRange: [0.5, 1.0]
      },
      anniversary: {
        colors: ['255, 0, 0', '220, 20, 60', '255, 105, 180', '255, 215, 0'],
        count: 55,
        sizeRange: [3, 9],
        speed: 0.35,
        animationType: 'bounce',
        opacityRange: [0.3, 0.7]
      }
    };

    const config = themeConfig[theme];
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      velocity: { x: number; y: number };
      color: string;
      rotation: number;
      rotationSpeed: number;
      phase: number;
      baseY: number;
    }> = [];

    for (let i = 0; i < config.count; i++) {
      const radius = Math.random() * (config.sizeRange[1] - config.sizeRange[0]) + config.sizeRange[0];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius,
        alpha: Math.random() * (config.opacityRange[1] - config.opacityRange[0]) + config.opacityRange[0],
        velocity: {
          x: (Math.random() - 0.5) * config.speed,
          y: (Math.random() - 0.5) * config.speed
        },
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3,
        phase: Math.random() * Math.PI * 2,
        baseY: 0
      });
    }

    let animationFrame: number;
    let frameCount = 0;

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, radius * 0.3);
      ctx.bezierCurveTo(-radius, -radius * 0.5, -radius * 0.5, -radius, 0, -radius * 0.3);
      ctx.bezierCurveTo(radius * 0.5, -radius, radius, -radius * 0.5, 0, -radius * 0.3);
      ctx.fill();
      ctx.restore();
    };

    const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawConfetti = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number, color: string, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.fillRect(-radius * 0.3, -radius, radius * 0.6, radius * 2.5);
      ctx.restore();
    };

    const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number, color: string, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.globalAlpha = alpha;
      
      // Center dot
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Sparkle rays
      ctx.strokeStyle = `rgba(${color}, ${alpha * 0.7})`;
      ctx.lineWidth = radius * 0.2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius);
        ctx.stroke();
        ctx.rotate(Math.PI / 2);
      }
      ctx.restore();
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      particles.forEach(particle => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.rotation += particle.rotationSpeed;
        particle.phase += 0.02;

        // Pulse effect
        const pulseAlpha = particle.alpha + Math.sin(particle.phase) * 0.2;
        const alpha = Math.max(0.1, Math.min(1, pulseAlpha));

        // Theme-specific movements
        switch (config.animationType) {
          case 'float':
            particle.y += Math.sin(frameCount * 0.01 + particle.phase) * 0.5;
            particle.x += Math.cos(frameCount * 0.015 + particle.phase) * 0.3;
            break;
          case 'wave':
            particle.y += Math.sin(frameCount * 0.015 + particle.phase) * 0.8;
            particle.x += Math.cos(frameCount * 0.01 + particle.phase) * 0.5;
            break;
          case 'spiral': {
            particle.rotation += 2;
            const spiralRadius = 0.5;
            particle.x += Math.cos(frameCount * 0.02 + particle.phase) * spiralRadius;
            particle.y += Math.sin(frameCount * 0.02 + particle.phase) * spiralRadius;
            break;
          }
          case 'sparkle':
            if (frameCount % 30 === 0) {
              particle.alpha = Math.random() * 0.5 + 0.5;
            }
            break;
          case 'bounce':
            particle.baseY += particle.velocity.y;
            particle.y = particle.baseY + Math.abs(Math.sin(frameCount * 0.03 + particle.phase)) * 20;
            break;
        }

        // Bounce off edges
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvas.height + 20;
        if (particle.y > canvas.height + 20) particle.y = -20;

        // Draw based on theme
        switch (theme) {
          case 'romantic':
            drawHeart(ctx, particle.x, particle.y, particle.radius, alpha, particle.color);
            break;
          case 'calm':
            drawCircle(ctx, particle.x, particle.y, particle.radius, alpha, particle.color);
            break;
          case 'playful':
            drawConfetti(ctx, particle.x, particle.y, particle.radius, alpha, particle.color, particle.rotation);
            break;
          case 'birthday':
            drawSparkle(ctx, particle.x, particle.y, particle.radius, alpha, particle.color, particle.rotation);
            break;
          case 'anniversary':
            drawHeart(ctx, particle.x, particle.y, particle.radius, alpha, particle.color);
            break;
          default:
            drawCircle(ctx, particle.x, particle.y, particle.radius, alpha, particle.color);
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}
