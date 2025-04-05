"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const renderCache: Record<string, boolean> = {};
export default function ThankYouAnimation({
  key,
  onComplete,
}: {
  key: string;
  onComplete?: () => void;
}) {
  const [animationData, setAnimationData] = useState<string>();

  useEffect(() => {
    fetch("/images/thankyou-lottie.json")
      .then((response) => response.json())
      .then(setAnimationData)
      .catch();
  }, []);

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Avoid reanimations on remount unless the key is unique to prevent "reanimations"
    // if (!renderCache[key]) {
    setTimeout(() => {
      // Delay animation for dramatic effect
      setAnimate(true);
    }, 500);
    // }

    // renderCache[key] = true;
  }, [setAnimate, key]);

  const handleComplete = () => {
    setAnimate(false);
    onComplete?.();
  };

  return (
    animate && (
      <Lottie
        className="bg-background/50"
        animationData={animationData}
        onComplete={handleComplete}
        loop={false}
      />
    )
  );
}
