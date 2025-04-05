import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/client/helpers/cn";

interface SlideshowProps {
  images: string[];
  interval?: number;
  className?: string;
}

const Slideshow = ({ images, interval = 7500, className }: SlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dipToBlack, setDipToBlack] = useState(false);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setDipToBlack(true);
      setTimeout(() => setDipToBlack(false), 700);
    }, interval);

    return () => {
      clearInterval(slideTimer);
    };
  }, [images.length, interval]);

  function prevIndex(index: number) {
    if (index === 0) {
      return images.length - 1;
    } else {
      return index - 1;
    }
  }

  return (
    <div
      className={cn(
        "relative w-full h-96 flex justify-center items-center overflow-hidden bg-black",
        className
      )}
    >
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          layout="fill"
          objectFit="cover"
          alt={`Slide ${index}`}
          style={{
            transitionDuration: `2s`,
          }}
          className={cn(
            "absolute w-full h-full object-cover transition-all opacity-0 blur-lg",
            {
              "opacity-100 blur-none": currentIndex === index && !dipToBlack,
              "opacity-20": index === prevIndex(currentIndex) && dipToBlack,
              "opacity-40": index === currentIndex && dipToBlack,
            }
          )}
        />
      ))}
    </div>
  );
};

export default Slideshow;
