import React from "react";
import { usePledgeStore } from "@/lib/client/store/pledgeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { StepProps } from "./types";

export default function StartStep({ goNext }: StepProps) {
  const { setContributionType } = usePledgeStore();

  return (
    <>
      <h4 className="text-xl text-center mb-8">
        How would you like to contribute?
      </h4>
      <div className="flex items-center justify-center gap-4 md:gap-8">
        <button
          onClick={() => {
            setContributionType("money");
            goNext();
          }}
          aria-labelledby="money-title"
          className="rounded-none hover:rounded-xl transition-all border duration-300 hover:ring-2 hover:ring-primary hover:border-primary hover:shadow-[0_4px_0_0_black] hover:-translate-y-1 focus:ring-2 focus:ring-primary focus:border-primary focus:shadow-[0_4px_0_0_black] focus:rounded-xl cursor-pointer focus:outline-none hover:bg-accent focus:bg-accent focus:-translate-y-1 "
        >
          <Card className="border-none bg-transparent">
            <CardContent className="pb-0">
              <Image
                src="/images/handmoney.svg"
                width={200}
                height={200}
                alt={"Monetary contribution"}
              />
            </CardContent>
            <CardHeader className="pt-0">
              <CardTitle
                id="money-title"
                className="text-primary text-center text-2xl"
              >
                Monetary Contribution
              </CardTitle>
            </CardHeader>
          </Card>
        </button>

        <button
          onClick={() => {
            setContributionType("in-kind");
            goNext();
          }}
          aria-labelledby="in-kind-title"
          className="rounded-none hover:rounded-xl transition-all border duration-300 hover:ring-2 hover:ring-primary hover:border-primary hover:shadow-[0_4px_0_0_black] focus:ring-2 hover:-translate-y-1 focus:ring-primary focus:border-primary focus:shadow-[0_4px_0_0_black] focus:rounded-xl cursor-pointer focus:outline-none hover:bg-accent focus:bg-accent focus:-translate-y-1 "
        >
          <Card className="border-none bg-transparent">
            <CardContent className="pb-0">
              <Image
                src="/images/brickwall.svg"
                width={200}
                height={200}
                alt={"Construction materials"}
              />
            </CardContent>
            <CardHeader className="pt-0">
              <CardTitle
                id="in-kind-title"
                className="text-primary text-center text-2xl"
              >
                In-Kind Contribution
              </CardTitle>
            </CardHeader>
          </Card>
        </button>
      </div>
      <div className="w-full flex justify-center mt-8">
        <Button
          onClick={() => {
            setContributionType("both");
            goNext();
          }}
          size="lg"
          variant="outline"
        >
          I would like to contribute both
        </Button>
      </div>
    </>
  );
}
