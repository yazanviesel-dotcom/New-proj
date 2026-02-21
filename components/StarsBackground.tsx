
import React, { useEffect, useRef } from 'react';

const StarsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Configuration
    // Reduced star count by half (was 150/400)
    const starCount = width < 768 ? 75 : 200;
    const speed = 0.1; // Slow drift
    
    // Vibrant Colors (Red, Green, Blue, Gold, White)
    const starColors = [
      '255, 255, 255', // White
      '50, 150, 255',  // Blue
      '255, 80, 80',   // Red
      '80, 255, 120',  // Green
      '255, 215, 0',   // Gold
    ];

    canvas.width = width;
    canvas.height = height;

    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      alpha: number;
    }

    const stars: Star[] = [];

    // Initialize Stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * width,
        size: Math.random() * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        alpha: Math.random()
      });
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Stars
      stars.forEach(star => {
        // Twinkle effect
        if (Math.random() > 0.99) star.alpha = Math.random();
        
        // Move slightly
        star.y -= speed * (star.size * 0.5);
        if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 1 }} 
    />
  );
};

export default StarsBackground;
