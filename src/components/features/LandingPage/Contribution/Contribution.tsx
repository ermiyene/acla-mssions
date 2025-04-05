"use client";
import { useEffect, useMemo } from "react";
import { usePledgeStore } from "@/lib/client/store/pledgeStore";
import { steps } from "./Steps/steps";
import Steps from "./StepDots/StepDots";
import {
  useCreatePledgeId,
  useGetPledge,
  useTransferMethods,
} from "@/lib/client/helpers/hooks/pledge.hooks";
import { usePhases } from "@/lib/client/helpers/hooks/in-kind-items.hooks";
import { useStringQueryParams } from "@/lib/client/helpers/useQueryParams";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import posthog from "posthog-js";

export default function Contribution() {
  const {
    contributionType,
    step,
    setStep,
    pledgeId,
    setPledgeId,
    resetPledgeForm,
  } = usePledgeStore();
  useTransferMethods(); // prefetch transfer methods
  usePhases(); // prefetch in-kind items
  const { getPledge, isLoading, error } = useGetPledge();
  const [urlStep, setUrlStep] = useStringQueryParams("step", "");
  const [urlPledgeId, setUrlPledgeId] = useStringQueryParams("pledgeId");

  const visibleSteps = useMemo(() => {
    if (!contributionType || contributionType === "both") {
      return steps;
    }
    return steps.filter((s) => !s.parent || s.parent === contributionType);
  }, [contributionType]);

  useEffect(() => {
    const contactInfoStep = visibleSteps?.findIndex(
      (s) => s?.title === "Contact Info"
    );
    if (urlStep === "verify" && step !== contactInfoStep) {
      setStep(contactInfoStep);
      document.getElementById("donation")?.scrollIntoView({
        behavior: "smooth",
      });
      setUrlStep("");
    } else if (urlStep === "verify") {
      document.getElementById("donation")?.scrollIntoView({
        behavior: "smooth",
      });
      setUrlStep("");
    }
  }, [setStep, setUrlStep, step, urlStep, visibleSteps]);

  useEffect(() => {
    const thankyouStep = visibleSteps?.findIndex(
      (s) => s?.title === "Thank You"
    );
    if (urlStep === "thankyou" && step !== thankyouStep) {
      setStep(thankyouStep);
      document.getElementById("donation")?.scrollIntoView({
        behavior: "smooth",
      });
      setUrlStep("");
    } else if (urlStep === "thankyou") {
      document.getElementById("donation")?.scrollIntoView({
        behavior: "smooth",
      });
      setUrlStep("");
    }
  }, [setStep, setUrlStep, step, urlStep, visibleSteps]);

  useEffect(() => {
    const confirmationStep = visibleSteps?.findIndex(
      (s) => s?.title === "Confirmation"
    );
    if (urlStep === "confirm" && step !== confirmationStep) {
      setStep(confirmationStep);
      document.getElementById("donation")?.scrollIntoView({
        behavior: "smooth",
      });
      setUrlStep("");
    } else if (urlStep === "confirm") {
      document.getElementById("donation")?.scrollIntoView({
        behavior: "smooth",
      });
      setUrlStep("");
    }
  }, [setStep, setUrlStep, step, urlStep, visibleSteps]);

  useEffect(() => {
    if (!!urlPledgeId && urlPledgeId !== pledgeId) {
      setPledgeId(urlPledgeId);
      getPledge(urlPledgeId);
      setUrlPledgeId("");
    }
  }, [urlPledgeId, pledgeId, setPledgeId, setUrlPledgeId, getPledge]);

  function canGoNext() {
    const totalSteps = visibleSteps.length;
    if (step >= totalSteps) {
      return false;
    }

    return true;
  }

  function goNext() {
    if (!canGoNext()) {
      return;
    }

    document.getElementById("donation")?.scrollIntoView({
      behavior: "smooth",
    });

    setStep(step + 1);
    posthog.capture("changed_step", {
      step: visibleSteps[step]?.title,
    });
  }

  function canGoBack() {
    return step > 0;
  }

  function goBack() {
    if (!canGoBack()) {
      return;
    }
    document.getElementById("donation")?.scrollIntoView({
      behavior: "smooth",
    });

    setStep(step - 1);
    posthog.capture("changed_step", {
      step: visibleSteps[step]?.title,
    });
  }

  function canStartOver() {
    return step > 0;
  }

  async function startOver() {
    if (!canStartOver()) {
      return;
    }

    document.getElementById("donation")?.scrollIntoView({
      behavior: "smooth",
    });

    posthog.capture("pledge_start_over");
    posthog.reset();

    resetPledgeForm();
    await usePledgeStore.persist.clearStorage(); // Clears storage based on middleware

    window.location.href = "/#donation";
  }

  function canGoToStep(step: number) {
    return step > 0 && step < visibleSteps.length;
  }

  function goToStep(step: number) {
    if (!canGoToStep(step)) {
      return;
    }
    setStep(step);
    posthog.capture("changed_step", {
      step: visibleSteps[step]?.title,
    });
  }

  function renderStep() {
    if (step < 0 || step >= visibleSteps.length) {
      setStep(0);
      return null;
    }
    const StepComponent = visibleSteps[step].component;

    return (
      <StepComponent
        canGoBack={canGoBack}
        canGoNext={canGoNext}
        canStartOver={canStartOver}
        canGoToStep={canGoToStep}
        goBack={goBack}
        goNext={goNext}
        goToStep={goToStep}
        startOver={startOver}
      />
    );
  }

  return (
    <section
      id="donation"
      className="py-32 bg-background relative z-0 min-h-[70vh] flex items-center"
    >
      <div className="container mx-auto px-8">
        <h2 className="text-4xl font-bold text-center text-primary mb-8">
          Make Your Contribution
        </h2>
        {isLoading ? (
          <LoadingSpinner className="h-12 w-12 bg-transparent mx-auto mt-12" />
        ) : (
          <>
            {renderStep()}
            {step > 0 && step < visibleSteps?.length - 1 && (
              <Steps
                className="mx-auto mt-16 w-full max-w-md cursor-pointer"
                steps={visibleSteps
                  ?.slice(1, visibleSteps?.length - 1)
                  ?.map((s) => s.title)}
                currentStep={step - 1}
              />
            )}
          </>
        )}
        {error && (
          <div className="text-destructive text-center mt-8">{error}</div>
        )}
      </div>
    </section>
  );
}
