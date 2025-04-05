"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StepProps } from "../types";
import { useProgress } from "@/lib/client/helpers/hooks/pledge.hooks";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import posthog from "posthog-js";
import { cn } from "@/lib/client/helpers/cn";
import { usePledgeStore } from "@/lib/client/store/pledgeStore";

const ThankYouAnimation = dynamic(() => import("./ThankYouAnimation"), {
  ssr: false,
});

export default function ThankYou({ startOver, canStartOver }: StepProps) {
  const { pledgeId } = usePledgeStore();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    posthog.capture("reached_thank_you_page");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setAnimationComplete(true);
    }, 3000); // set animation complete manually if it takes more than 3 seconds
  }, []);

  return (
    <div className="container mx-auto px-0 md:px-8 relative overflow-hidden">
      <div className="max-w-md mx-auto flex flex-col overflow-hidden">
        <div
          className={cn(
            "max-w-md mx-auto flex flex-col gap-6 text-center opacity-0 transition-opacity",
            {
              "opacity-100": animationComplete,
            }
          )}
        >
          <hr />
          <h3 className="text-3xl font-bold text-primary mt-4">Thank You!</h3>
          <p className="text-xl max-w-sm mx-auto">
            Your contribution is under verification. We appreciate your support!
          </p>
          {/* <Progress value={query?.data?.data?.progress} className="w-full" /> */}
          {/* <p>{query?.data?.data?.progress}% of our goal reached</p> */}

          <Button
            disabled={!canStartOver()}
            onClick={startOver}
            className="w-full"
          >
            Make Another Contribution
          </Button>
        </div>

        <div className="absolute top-0 left-0 w-full h-full grid place-content-center pointer-events-none !m-0">
          <Suspense fallback={null}>
            <ThankYouAnimation
              onComplete={() => {
                setAnimationComplete(true);
              }}
              key={pledgeId || "thankyou"}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
