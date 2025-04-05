import { useRef, useEffect, RefObject } from "react";
import { GridCell } from "./GridCell";
import { gridItems } from "./gridItems";
import posthog from "posthog-js";

function useAnimate() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const speed = 0.5; // Adjust speed as needed (pixels per frame)
  const directionRef = useRef(1); // 1 for forward, -1 for reverse
  const isPausedRef = useRef(false); // Track pause state

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const scroll = () => {
      if (!scrollContainer || isPausedRef.current) {
        animationFrameId = requestAnimationFrame(scroll); // Keep the loop alive
        return;
      }

      // Update scroll position
      scrollContainer.scrollLeft += speed * directionRef.current;

      // Check bounds and reverse direction if needed
      if (
        scrollContainer.scrollLeft + scrollContainer.clientWidth >=
        scrollContainer.scrollWidth
      ) {
        directionRef.current = -1; // Reverse direction
      } else if (scrollContainer.scrollLeft <= 0) {
        directionRef.current = 1; // Forward direction
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const pauseScrolling = () => {
    posthog.capture("collage_paused");

    setTimeout(() => {
      isPausedRef.current = true;
    }, 500 * speed);
  };

  const resumeScrolling = () => {
    setTimeout(() => {
      isPausedRef.current = false;
    }, 500 * speed);
  };

  return { scrollRef, pauseScrolling, resumeScrolling };
}

export default function Collage() {
  const { scrollRef, pauseScrolling, resumeScrolling } = useAnimate();

  return (
    <div className="relative z-0 w-full overflow-hidden flex h-[550px] max-sm:scale-[84%] max-sm:w-[118%] max-sm:-translate-x-[7.5%]">
      <div
        className="absolute z-10 w-[130%] h-full top-0 left-[-15%] pointer-events-none"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, black 5%, transparent, transparent, black 95%)",
        }}
      />
      <div className="relative z-10 w-full h-full overflow-hidden">
        <div
          ref={scrollRef}
          className="overflow-auto grid auto-cols-[300px] grid-flow-col grid-rows-[repeat(2,_1fr)] no-scrollbar"
        >
          {gridItems.map((item, index) => (
            <GridCell
              key={`${item.id}-${index}`}
              onMouseEnter={pauseScrolling}
              onMouseLeave={resumeScrolling}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
