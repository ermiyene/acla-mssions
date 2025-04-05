"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import posthog from "posthog-js";
import React, { useEffect, useState } from "react";

interface ProgressCardProps {
  value: number;
}
export default function ProgressCard({ value }: ProgressCardProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let count = 1;

    const timer = setInterval(() => {
      count = count * (1 + 1 / count);
      if (count >= value) {
        setProgress(value);
        clearInterval(timer);
        return;
      }
      setProgress(count);
    }, 50);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-white p-8 border border-b-0 container w-full max-w-xl rounded-none max-md:mt-auto">
      <p className="text-primary mb-1 text-2xl">
        Praise God for what&apos;s been raised so far!
      </p>
      {/* <Progress value={progress} className="mb-5" /> */}
      <p className="text-primary mb-7">
        Your support helps us build a space for worship, education, and service.
      </p>
      <Button
        className="w-full rounded-none"
        size={"lg"}
        onClick={() =>
        {
          document
            .getElementById("donation")
            ?.scrollIntoView({ behavior: "smooth" });

          posthog.capture("clicked_hero_donate_now");
        }
        }
      >
        Donate Now
      </Button>
    </div>
  );
}
