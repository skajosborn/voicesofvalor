import React, { useEffect, useRef } from 'react';
import { globalAudioEngine } from '../services/audioEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
  accentColor?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  accentColor = '#d4af37',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let fallbackPhase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const analyser = globalAudioEngine.getAnalyser();

      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Draw frequency bars
        const barWidth = (width / 32) - 2;
        let barX = 0;

        for (let i = 0; i < 32; i++) {
          const sampleIndex = Math.floor(i * (bufferLength / 48));
          const value = dataArray[sampleIndex] || 0;
          const barHeight = Math.max(3, (value / 255) * height * 0.9);

          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, `${accentColor}33`);
          gradient.addColorStop(1, accentColor);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(barX, height - barHeight, Math.max(2, barWidth), barHeight, [2, 2, 0, 0]);
          ctx.fill();

          barX += barWidth + 2;
        }
      } else {
        // Subtle ambient idle sine wave
        fallbackPhase += 0.04;
        ctx.beginPath();
        ctx.strokeStyle = `${accentColor}44`;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < width; x += 4) {
          const y = (height / 2) + Math.sin(x * 0.04 + fallbackPhase) * (isPlaying ? 8 : 2);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, accentColor]);

  return (
    <div className="w-full h-12 flex items-center justify-center overflow-hidden rounded bg-black/40 border border-valor-gold/10 px-2">
      <canvas
        ref={canvasRef}
        width={360}
        height={48}
        className="w-full h-full"
        aria-label="Real-time audio frequency visualizer"
      />
    </div>
  );
};
