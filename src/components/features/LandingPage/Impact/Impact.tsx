import { cn } from "@/lib/client/helpers/cn";
import Image from "next/image";
import posthog from "posthog-js";
import {
  Suspense,
  lazy,
  startTransition,
  useEffect,
  useRef,
  useState,
} from "react";

const Collage = lazy(() => import("./Collage/Collage"));

export default function Impact() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [dynamicHeight, setDynamicHeight] = useState(720);

  useEffect(() => {
    function handleResize() {
      startTransition(() => {
        if (ref.current) {
          setDynamicHeight(ref.current.offsetWidth * 0.5625);
        }
      });
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      id="impact"
      className="pt-24 bg-zinc-900 relative z-10 flex flex-col gap-10 w-full group"
    >
      <Image
        src="/images/contour-pattern.svg"
        alt="Impact"
        layout="fill"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10"
      />
      <h2 className="text-4xl font-bold text-center text-primary-foreground mb-8">
        About the project
      </h2>{" "}
      <div
        className={cn(
          "container bg-black overflow-hidden relative z-10 flex justify-center w-fit p-0 max-w-screen"
        )}
      >
        <iframe
          ref={ref}
          onClick={() => {
            posthog.capture("clicked_impact_video");
          }}
          className="max-w-full shadow-lg"
          width="1280"
          height={dynamicHeight}
          src="https://www.youtube.com/embed/rlJfSxc8X2Y"
          title="Build To Impact Generations"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
      <Suspense fallback={null}>
        <Collage />
      </Suspense>
    </section>
  );
}
