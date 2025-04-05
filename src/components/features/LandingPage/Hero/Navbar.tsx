"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/client/helpers/cn";
import posthog from "posthog-js";

export default function Navbar() {
  return (
    <nav
      className={cn(
        "fixed w-full left-0 z-50 bg-black/50 backdrop-blur-md mx-auto min-h-20 px-16 lg:px-44 py-4 flex items-center justify-between flex-wrap gap-2",
        "max-sm:px-4"
      )}
    >
      <Link href="/">
        <Button
          className="max-sm:p-0 hover:underline-none text-xl"
          variant="link"
        >
          <span className="font-bold text-white"> EQUIP | ACLA </span>
          <span className="text-accent">Building Project</span>
        </Button>
      </Link>

      <ul className="hidden md:flex gap-4 uppercase dark">
        {/* {currentUser ? (
          <Link href="/admin">
            <Button className="uppercase max-sm:p-0" variant="link">
              Dashboard
            </Button>
          </Link>
        ) : ( */}
        <>
          <li>
            <Link href="#impact">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  document
                    .getElementById("impact")
                    ?.scrollIntoView({ behavior: "smooth" });
                  posthog.capture("clicked_navbar_about");
                }}
                className="uppercase max-sm:p-0"
                variant="link"
              >
                About
              </Button>
            </Link>
          </li>
          <li>
            <Link href="#donation">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  document
                    .getElementById("donation")
                    ?.scrollIntoView({ behavior: "smooth" });
                  posthog.capture("clicked_navbar_donate");
                }}
                className="uppercase max-sm:p-0"
                variant="link"
              >
                Donate
              </Button>
            </Link>
          </li>
        </>
        {/* )} */}
      </ul>
    </nav>
  );
}
