import React from "react";
import { useContourAnimation } from "./useContourAnimation";

interface ContourPatternProps {
  className?: string;
  color?: string;
  speed?: number;
  animated?: boolean;
}

const ContourPattern: React.FC<ContourPatternProps> = ({
  className = "",
  color = "hsla(43, 100%, 63%, 0.5)",
  speed = 40000,
  animated,
}) => {
  const canvasRef = useContourAnimation(color, speed, animated);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    />
  );
};

 export default ContourPattern;
