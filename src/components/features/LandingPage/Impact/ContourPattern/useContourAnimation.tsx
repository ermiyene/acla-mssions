import { useCallback, useEffect, useRef } from "react";

export const useContourAnimation = (
  color: string = "rgba(59, 130, 246, 0.1)",
  speed: number = 4000,
  animated: boolean = true
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, frame: number) => {
      const { width, height } = ctx.canvas;
      ctx.clearRect(0, 0, width, height);

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "transparent");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;

      // Draw contour lines
      for (let i = 0; i < width + height; i += 20) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 5) {
          const y = i - x + Math.sin((x + frame) / 50) * 20;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    },
    [color]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const frame = ((timestamp - startTime) / speed) * 1000;

      draw(ctx, frame);
      if (!animated) {
        return;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [draw, speed, animated]);

  return canvasRef;
};
