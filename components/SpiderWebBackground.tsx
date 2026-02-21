
import React, { useEffect, useRef } from 'react';

const SpiderWebBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Configuration for performance
    // Reduce particle count on smaller screens
    const particleCount = width < 768 ? 35 : 70; 
    const connectionDistance = width < 768 ? 100 : 150;
    const mouseRepelRadius = 200;

    canvas.width = width;
    canvas.height = height;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }

    const particles: Particle[] = [];

    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5, // Slow velocity for calmness
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    // Interaction State
    let mouseX: number | null = null;
    let mouseY: number | null = null;
    let isClicking = false;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
        if ('touches' in e) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        } else {
            mouseX = (e as MouseEvent).clientX;
            mouseY = (e as MouseEvent).clientY;
        }
    };

    const handleDown = () => { isClicking = true; };
    const handleUp = () => { isClicking = false; };
    const handleLeave = () => { mouseX = null; mouseY = null; isClicking = false; };

    // Listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('touchstart', handleDown);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    window.addEventListener('mouseleave', handleLeave);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Detect Dark Mode based on HTML class
      const isDark = document.documentElement.classList.contains('dark');
      const particleColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
      const lineColor = isDark ? '255, 255, 255' : '0, 0, 0';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Interaction Logic (Repel/Attract)
        if (mouseX !== null && mouseY !== null) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseRepelRadius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseRepelRadius - distance) / mouseRepelRadius;
                
                // If clicking, stronger repel (explosion effect), else gentle push
                const strength = isClicking ? 15 : 2; 
                const direction = 1; // 1 = push away

                p.vx += forceDirectionX * force * strength * direction * 0.05;
                p.vy += forceDirectionY * force * strength * direction * 0.05;
            }
        }

        // Update Position
        p.x += p.vx;
        p.y += p.vy;

        // Boundary Check (Bounce)
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Draw Connections
        for (let j = i; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity * 0.2})`; // Low opacity for performance & look
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('touchstart', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
      window.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }} 
    />
  );
};

export default SpiderWebBackground;
