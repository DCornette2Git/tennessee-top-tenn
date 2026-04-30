import React, { useRef, useEffect } from 'react';

const ParanormalBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Color palettes
    const colors = {
      orange: ['#ff4500', '#cc3300'],
      green: ['#39ff14', '#00cc44']
    };

    // Helper for random numbers
    const random = (min, max) => Math.random() * (max - min) + min;

    class Spirit {
      constructor() {
        this.reset();
        // Scatter initially so they don't all start at the bottom at once
        this.y = random(0, canvas.height);
      }

      reset() {
        this.x = random(0, canvas.width);
        this.y = canvas.height + random(10, 100);
        this.baseSize = random(40, 150);
        this.size = this.baseSize;
        // Smaller spirits are faster to create depth
        this.speedY = random(0.5, 1.5) * (this.baseSize < 80 ? 1.5 : 0.8);
        this.speedX = random(-0.2, 0.2);
        this.swaySpeed = random(0.01, 0.03);
        this.swayAmount = random(20, 50);
        this.angle = random(0, Math.PI * 2);
        
        const isOrange = Math.random() > 0.5;
        this.color1 = isOrange ? colors.orange[0] : colors.green[0];
        this.color2 = isOrange ? colors.orange[1] : colors.green[1];
        
        this.maxOpacity = random(0.05, 0.2); // Subtle opacity
        this.opacity = 0;
        this.life = 0;
        this.maxLife = random(300, 700); // frames
        this.fadeSpeed = this.maxOpacity / 100;
      }

      update() {
        this.y -= this.speedY;
        this.angle += this.swaySpeed;
        // Subtle sine wave horizontal sway
        this.x += Math.sin(this.angle) * (this.swayAmount * 0.05) + this.speedX;
        
        this.life++;

        // Fade in, peak, then fade out
        if (this.life < 100) {
          this.opacity = Math.min(this.opacity + this.fadeSpeed, this.maxOpacity);
        } else if (this.life > this.maxLife - 100) {
          this.opacity = Math.max(this.opacity - this.fadeSpeed, 0);
        }

        // Respawn if out of bounds or dead
        if (this.y < -this.size * 2 || this.life >= this.maxLife) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.beginPath();
        
        // Translate and scale for an elliptical/wispy shape
        ctx.translate(this.x, this.y);
        ctx.scale(1, 1.5); 

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        grad.addColorStop(0, this.color1);
        grad.addColorStop(0.4, this.color2);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Particle {
      constructor() {
        this.reset();
        this.y = random(0, canvas.height); // Initial scatter
      }
      
      reset() {
        this.x = random(0, canvas.width);
        this.y = canvas.height + random(10, 50);
        this.size = random(1, 2.5);
        this.speedY = random(1, 2.5);
        this.speedX = random(-0.5, 0.5);
        const isOrange = Math.random() > 0.5;
        this.color = isOrange ? colors.orange[0] : colors.green[0];
        this.baseOpacity = random(0.2, 0.6);
        this.opacity = this.baseOpacity;
        this.flickerSpeed = random(0.05, 0.1);
        this.angle = random(0, Math.PI * 2);
      }
      
      update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * 0.5;
        this.angle += this.flickerSpeed;
        
        // Flicker effect
        this.opacity = this.baseOpacity + Math.sin(this.angle * 5) * 0.3;

        if (this.y < -this.size) {
          this.reset();
        }
      }
      
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Pulse {
      constructor() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.maxSize = 0;
        this.opacity = 0;
        this.color = '';
      }
      
      trigger() {
        // Occasional faint, brief radial pulse glow
        if (!this.active && Math.random() < 0.003) { // ~0.3% chance per frame
          this.active = true;
          this.x = random(100, canvas.width - 100);
          this.y = random(100, canvas.height - 100);
          this.maxSize = random(150, 400);
          this.size = 10;
          this.opacity = random(0.1, 0.2); // Very faint
          const isOrange = Math.random() > 0.5;
          this.color = isOrange ? colors.orange[0] : colors.green[0];
        }
      }
      
      update() {
        if (!this.active) return;
        this.size += 8; // Expand outward
        this.opacity -= 0.002; // Fade out
        if (this.opacity <= 0) {
          this.active = false;
        }
      }
      
      draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.beginPath();
        
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Instantiation
    const spirits = Array.from({ length: 18 }, () => new Spirit());
    const particles = Array.from({ length: 60 }, () => new Particle());
    const pulse = new Pulse();

    // Render loop
    const render = () => {
      // Clear canvas with near-black (#0a0a0a) background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Composite operation for soft blending
      ctx.globalCompositeOperation = 'screen';

      // Draw entities
      spirits.forEach(spirit => {
        spirit.update();
        spirit.draw(ctx);
      });

      pulse.trigger();
      pulse.update();
      pulse.draw(ctx);

      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Keep strictly behind all other UI content
        pointerEvents: 'none' // Ensure it never blocks interactions
      }}
    />
  );
};

export default ParanormalBackground;
