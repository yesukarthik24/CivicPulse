import React, { useEffect, useRef } from 'react';

export const HeroCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Node points with severity levels and positions
    const nodes = [
      { x: width * 0.25, y: height * 0.35, severity: 'Critical', color: '#F43F5E', radius: 7, pulse: 0, label: 'Pothole Hazard #88' },
      { x: width * 0.28, y: height * 0.42, severity: 'High', color: '#F59E0B', radius: 5, pulse: 1, label: 'Water Leak #94' },
      { x: width * 0.55, y: height * 0.28, severity: 'High', color: '#F59E0B', radius: 6, pulse: 2, label: 'Signal Failure #91' },
      { x: width * 0.62, y: height * 0.65, severity: 'Medium', color: '#06B6D4', radius: 5, pulse: 0.5, label: 'Streetlight #78' },
      { x: width * 0.75, y: height * 0.45, severity: 'Critical', color: '#F43F5E', radius: 8, pulse: 1.5, label: 'Bridge Structural #96' },
      { x: width * 0.40, y: height * 0.70, severity: 'Low', color: '#10B981', radius: 4, pulse: 3, label: 'Debris Dumping #64' },
      { x: width * 0.18, y: height * 0.60, severity: 'Medium', color: '#06B6D4', radius: 5, pulse: 2.2, label: 'Sewage Leak #85' },
    ];

    // Telemetry data packets moving along connections
    const packets = [
      { from: 0, to: 1, progress: 0, speed: 0.008 },
      { from: 1, to: 4, progress: 0.3, speed: 0.005 },
      { from: 2, to: 3, progress: 0.6, speed: 0.007 },
      { from: 3, to: 4, progress: 0.1, speed: 0.006 },
      { from: 6, to: 0, progress: 0.8, speed: 0.009 }
    ];

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Cluster Connection Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 260) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 * (1 - dist / 260)})`;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // Draw Data Beams (Packets)
      packets.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const start = nodes[p.from];
        const end = nodes[p.to];
        const px = start.x + (end.x - start.x) * p.progress;
        const py = start.y + (end.y - start.y) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#22D3EE';
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Nodes & Expanding Priority Waves
      nodes.forEach(node => {
        node.pulse += 0.04;
        const maxWave = 35;
        const waveRadius = (node.pulse * 15) % maxWave;
        const alpha = Math.max(0, 1 - waveRadius / maxWave);

        // Expanding ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, waveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.globalAlpha = alpha * 0.6;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node Label Box
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(241, 245, 249, 0.75)';
        ctx.fillText(node.label, node.x + 12, node.y + 4);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-[#07090E]/60" />
    </div>
  );
};
