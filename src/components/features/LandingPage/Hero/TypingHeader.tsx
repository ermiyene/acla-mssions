import { useState, useEffect } from "react";

interface UseTypingEffectProps {
  strings: string[];
  typingSpeed?: number;
  pauseTime?: number;
  initialDelay?: number;
}

const useTypingEffect = ({
  strings,
  typingSpeed = 100,
  pauseTime = 2000,
  initialDelay = 3000,
}: UseTypingEffectProps): string => {
  const [currentString, setCurrentString] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isInitialDelay, setIsInitialDelay] = useState<boolean>(true);

  useEffect(() => {
    if (isInitialDelay) {
      setCurrentString(strings[0]);
      const initialDelayTimeout = setTimeout(() => {
        setIsInitialDelay(false);
        setIndex(1);
      }, initialDelay);
      return () => clearTimeout(initialDelayTimeout);
    }

    const handleTyping = () => {
      const fullString = strings[index];
      const isComplete = !isDeleting && charIndex === fullString.length;

      if (isComplete) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setIndex((prevIndex) => (prevIndex + 1) % strings.length);
      } else {
        const nextCharIndex = isDeleting ? charIndex - 1 : charIndex + 1;
        setCurrentString(fullString.substring(0, nextCharIndex));
        setCharIndex(nextCharIndex);
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimeout);
  }, [
    charIndex,
    isDeleting,
    index,
    isInitialDelay,
    strings,
    typingSpeed,
    pauseTime,
    initialDelay,
  ]);

  return currentString;
};

interface TypingAnimationProps {
  strings: string[];
  typingSpeed?: number;
  pauseTime?: number;
  initialDelay?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  strings,
  typingSpeed,
  pauseTime,
  initialDelay = 5000,
}) => {
  const text = useTypingEffect({
    strings,
    typingSpeed,
    pauseTime,
    initialDelay,
  });

  return (
    <h1 className="text-5xl md:text-6xl font-bold text-background mt-[150px] md:mt-[250px] py-16 text-center max-w-[min(576px,100vw)] min-h-[300px] md:min-h-[400px] overflow-hidden">
      <span>{text}</span>
      <span
        className="border-l border-white ml-1 h-2 opacity-0"
        style={{
          animation: "blink 0.5s steps(2, end) infinite",
          animationDelay: `${initialDelay}ms`,
        }}
      />
    </h1>
  );
};

export default TypingAnimation;