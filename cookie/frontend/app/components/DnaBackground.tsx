'use client';

import React, { useEffect, useRef } from 'react';

export default function DnaBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Double helix definition
    interface Helix {
      centerX: number;
      centerY: number;
      length: number;
      angle: number; // orientation angle
      amplitude: number;
      frequency: number; // wave count
      speed: number;
      dotColor: string;
      lineColor: string;
    }

    const helices: Helix[] = [
      {
        centerX: width * 0.25,
        centerY: height * 0.5,
        length: Math.max(height * 0.8, 600),
        angle: -Math.PI / 6, // slanted
        amplitude: 65,
        frequency: 2.2,
        speed: 0.006,
        dotColor: 'rgba(167, 139, 250, 0.07)', // faint lavender
        lineColor: 'rgba(139, 92, 246, 0.03)', // faint violet
      },
      {
        centerX: width * 0.8,
        centerY: height * 0.4,
        length: Math.max(height * 0.7, 500),
        angle: Math.PI / 8, // slanted the other way
        amplitude: 45,
        frequency: 2.8,
        speed: -0.008, // rotates opposite direction
        dotColor: 'rgba(99, 102, 241, 0.05)',  // faint indigo
        lineColor: 'rgba(99, 102, 241, 0.02)', // faint indigo
      }
    ];

    let rotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render custom grid/mesh structure for "DNA digital matrix" feel
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.01)';
      ctx.lineWidth = 1;
      const gridSize = 80;
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

      rotation += 0.01;

      helices.forEach((helix) => {
        // Adjust center positions on resize
        if (helix.centerX > width) helix.centerX = width * 0.8;
        
        const numPoints = 35;
        const localRot = rotation * helix.speed * 100;

        for (let i = 0; i < numPoints; i++) {
          const t = i / (numPoints - 1);
          // Position along the length of the helix (-length/2 to length/2)
          const dist = (t - 0.5) * helix.length;

          // Compute wave phase angle
          const phase = t * helix.frequency * Math.PI * 2 + localRot;

          // 3D-like coordinate offsets (Y' is along helix length, X' and Z' represent rotation around the axis)
          const xOffset1 = Math.cos(phase) * helix.amplitude;
          const z1 = Math.sin(phase) * helix.amplitude; // depth for sizing/shading

          const xOffset2 = Math.cos(phase + Math.PI) * helix.amplitude;
          const z2 = Math.sin(phase + Math.PI) * helix.amplitude;

          // Project coordinates to screen space taking helix angle into account
          const cosAngle = Math.cos(helix.angle);
          const sinAngle = Math.sin(helix.angle);

          // Strand 1 screen coordinates
          const s1x = helix.centerX + dist * cosAngle - xOffset1 * sinAngle;
          const s1y = helix.centerY + dist * sinAngle + xOffset1 * cosAngle;

          // Strand 2 screen coordinates
          const s2x = helix.centerX + dist * cosAngle - xOffset2 * sinAngle;
          const s2y = helix.centerY + dist * sinAngle + xOffset2 * cosAngle;

          // Draw the connecting rung (line between strands)
          const alphaFactor = (z1 + helix.amplitude) / (2 * helix.amplitude); // 0 to 1 based on depth
          ctx.strokeStyle = helix.lineColor;
          ctx.lineWidth = 0.8 + alphaFactor * 0.8;
          ctx.beginPath();
          ctx.moveTo(s1x, s1y);
          ctx.lineTo(s2x, s2y);
          ctx.stroke();

          // Draw node 1
          const size1 = 1.5 + alphaFactor * 2.5; // larger when in front
          ctx.fillStyle = helix.dotColor;
          ctx.beginPath();
          ctx.arc(s1x, s1y, size1, 0, Math.PI * 2);
          ctx.fill();

          // Draw node 2
          const size2 = 1.5 + (1 - alphaFactor) * 2.5;
          ctx.beginPath();
          ctx.arc(s2x, s2y, size2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
