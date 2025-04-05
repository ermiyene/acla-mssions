"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import TypingAnimation from "./TypingHeader";
import ProgressCard from "./ProgressCard";
import { useProgress } from "@/lib/client/helpers/hooks/pledge.hooks";
import Slideshow from "./Slideshow";

export default function Hero() {
  const [animate, setAnimate] = useState(0);
  const query = useProgress();

  useEffect(() => {
    const handleScroll = () => {
      const currPos = {
        x: window.scrollX,
        y: window.scrollY,
      };
      const viewportHeight = window.innerHeight;
      const newBlur = Math.min(currPos.y / viewportHeight, 1);
      setAnimate(newBlur);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-svh min-h-fit bg-white">
      <Navbar />
      <div
        className="fixed z-0 inset-0 h-full overflow-hidden"
        style={{
          transform: `scale(${1 + animate * 1})`,
        }}
      >
        <Slideshow
          interval={7500}
          className="w-full h-full"
          images={[
            "/images/slideshow/3.jpg",
            "/images/slideshow/1.jpg",
            "/images/slideshow/2.jpg",
            "/images/slideshow/4.jpg",
            "/images/slideshow/3.jpg",
            "/images/slideshow/5.jpg",
            "/images/slideshow/2.jpg",
          ]}
        />
        {/* <video
          className="w-full object-cover h-full"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://videos.pexels.com/video-files/2014792/2014792-hd_1920_1080_24fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video> */}
        <div
          className="absolute inset-0 bg-black bg-opacity-20 h-full w-full z-[1]"
          style={{
            backdropFilter: `blur(${animate * 30}px)`,
            transition: "backdropFilter 0.2s",
          }}
        ></div>
      </div>
      <div className="relative z-10 h-full min-h-fit flex flex-col items-center justify-start">
        <TypingAnimation
          strings={[
            "Build to Impact Generations ",
            "From here to the nations!",
          ]}
        />
        <ProgressCard value={query?.data?.data?.progress || 0} />
      </div>
    </section>
  );
}
