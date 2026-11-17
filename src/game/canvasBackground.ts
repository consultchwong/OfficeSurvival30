/**
 * HTML5 Canvas lightweight particle & impact burst layer.
 * Static urban blueprint & skyline live in CSS so the canvas never copies a full-viewport bitmap per frame.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  type: 'dust' | 'paper' | 'burst';
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
}

export class CanvasBackgroundEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animId: number | null = null;
  private particles: Particle[] = [];
  private width = 0;
  private height = 0;
  private trauma = 0;
  private isLowHealth = false;

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.handleResize();
    this.initAmbient();
    this.startLoop();
  }

  public handleResize() {
    if (!this.canvas) return;
    const dpr = 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    if (this.ctx) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  private initAmbient() {
    this.particles = [];
    const colors = ['#f59e0b', '#0ea5e9', '#10b981', '#e11d48'];
    for (let i = 0; i < 16; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.25 - Math.random() * 0.3,
        size: 5 + Math.random() * 5,
        alpha: 0.16 + Math.random() * 0.16,
        color: colors[i % colors.length],
        type: 'dust',
        life: 1,
        maxLife: 1,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
      });
    }
  }

  public triggerImpact(isPositive: boolean) {
    this.trauma = Math.min(this.trauma + 0.35, 0.75);
    const count = 16;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const colors = isPositive
      ? ['#059669', '#f59e0b', '#0284c7', '#fbbf24']
      : ['#dc2626', '#ea580c', '#0f172a', '#f59e0b'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 6;
      this.particles.push({
        x: cx,
        y: cy - 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 6,
        alpha: 0.95,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'burst',
        life: 0,
        maxLife: 30 + Math.random() * 15,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25,
      });
    }
  }

  public triggerConfetti() {
    const colors = ['#f59e0b', '#e11d48', '#0284c7', '#059669', '#7c3aed'];
    for (let i = 0; i < 65; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: -15,
        vx: (Math.random() - 0.5) * 3.5,
        vy: 2.2 + Math.random() * 4.5,
        size: 7 + Math.random() * 7,
        alpha: 0.95,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'paper',
        life: 0,
        maxLife: 120 + Math.random() * 45,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.12,
      });
    }
  }

  public setLowHealthWarning(isLow: boolean) {
    this.isLowHealth = isLow;
  }

  private startLoop() {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const rawDt = (time - lastTime) / 1000;
      const dt = Math.min(rawDt, 0.05);
      lastTime = time;

      this.update(dt);
      this.render();

      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  }

  private update(dt: number) {
    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - dt * 1.6);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;

      if (p.type === 'burst' || p.type === 'paper') {
        p.life += 1;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        p.vy += 0.1;

        if (p.life >= p.maxLife || p.y > this.height + 24) {
          this.particles.splice(i, 1);
        }
      } else if (p.type === 'dust') {
        if (p.y < -15) {
          p.y = this.height + 15;
          p.x = Math.random() * this.width;
        }
        if (p.x < -15) p.x = this.width + 15;
        if (p.x > this.width + 15) p.x = -15;
      }
    }
  }

  private render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.save();

    if (this.trauma > 0) {
      const shakeX = (Math.random() - 0.5) * this.trauma * 14;
      const shakeY = (Math.random() - 0.5) * this.trauma * 14;
      ctx.translate(shakeX, shakeY);
    }

    for (const p of this.particles) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.type === 'paper' || p.type === 'dust') {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (this.isLowHealth) {
      const pulse = 0.25 + Math.sin(performance.now() * 0.007) * 0.12;
      ctx.fillStyle = `rgba(220, 38, 38, ${pulse})`;
      ctx.fillRect(0, 0, this.width, 10);
      ctx.fillRect(0, this.height - 10, this.width, 10);
    }

    ctx.restore();
  }

  public destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
