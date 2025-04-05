"use client";
import { useEffect, useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/client/helpers/cn";
import { usePledgeStore } from "@/lib/client/store/pledgeStore";
import { StepProps } from "./types";
import { usePhases } from "@/lib/client/helpers/hooks/in-kind-items.hooks";
import { toast } from "sonner";
import { formatErrorMessage } from "@/lib/common/utils/error";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function SelectItems({ canGoBack, goBack, goNext, canGoNext }: StepProps) {
  const [phase, setPhase] = useState<number>(0);
  const { data: phases, isLoading, error } = usePhases();
  const filteredPhases = phases
    ?.map((p) => ({
      ...p,
      categories: p.categories?.filter((c) => c.items?.length > 0),
    }))
    ?.filter((p) => p.categories?.length > 0);

  useEffect(() => {
    if (error) {
      toast.error(formatErrorMessage(error, "Failed to fetch items"));
    }
  }, [error]);

  const {
    selectedItems,
    removeSelectedItem,
    addSelectedItem,
    changeAmountOfSelectedItem,
  } = usePledgeStore();

  const handleRemoveItem = (id: string) => {
    removeSelectedItem(id);
  };

  const handleAddItem = (item: { id: string; name: string; unit: string }) => {
    addSelectedItem({ ...item });
  };

  const handleAmountChange = (id: string, amount: number) => {
    changeAmountOfSelectedItem(id, amount);
  };

  const handleNextPhase = () => {
    if (phase >= 2 && canGoNext()) {
      goNext();
    }
    setPhase((prev) => prev + 1);
    document.getElementById("donation")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handlePrevPhase = () => {
    if (phase > 0) {
      setPhase((prev) => prev - 1);
    }
    document.getElementById("donation")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="container mx-auto px-0 md:px-8">
      <h4 className="text-xl text-center mb-8">What can you contribute?</h4>

      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <LoadingSpinner className="mx-auto h-12 w-12 bg-transparent" />
        ) : (
          <div className="">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-primary">
                {filteredPhases[phase].name}
              </h3>
              <div className="flex justify-center">
                {filteredPhases[phase].icon}
              </div>
            </div>
            {filteredPhases[phase].categories.map((category, index) => (
              <div key={index} className="mb-6">
                <h4 className="text-lg font-semibold text-primary mb-2">
                  {category.name}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item, itemIndex) => {
                    const isSelected = selectedItems.some(
                      (i) => i.id === item.id
                    );
                    const selectedItem = selectedItems.find(
                      (i) => i.id === item.id
                    );
                    const covered =
                      (item?.maxQuantity || 0) <= (item?.currentQuantity || 0);
                    return (
                      <div
                        key={itemIndex}
                        className={cn("relative min-h-[66px] cursor-pointer")}
                        onClick={() => !covered && handleAddItem(item)}
                      >
                        <div
                          className={cn(
                            `p-4 rounded-none bg-background border border-border flex flex-col group top-0 left-0 w-full hover:md:absolute min-h-full justify-center`,
                            {
                              "border-primary bg-white hover:z-10 hover:shadow-lg":
                                isSelected,
                              "border-green-500 bg-green-50": covered,
                            }
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-medium text-primary`}>
                              {item.name}
                            </span>

                            {!!selectedItem?.amount && (
                              <span className="ml-auto pl-2 mr-2 text-nowrap">
                                ({selectedItem?.amount} {item.unit})
                              </span>
                            )}
                            {covered ? (
                              <div className="">Fully Covered</div>
                            ) : (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  if (isSelected) {
                                    handleRemoveItem(item?.id);
                                  } else {
                                    handleAddItem(item);
                                  }
                                }}
                                variant={"default"}
                                size="sm"
                              >
                                {isSelected ? (
                                  <>
                                    <XIcon /> Remove
                                  </>
                                ) : (
                                  <>
                                    <PlusIcon /> Add
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                          {isSelected && (
                            <div className="group-hover:mt-4 h-0 overflow-hidden group-hover:h-[40px] max-md:transition-all group-hover:transition-all">
                              <div className="flex items-center space-x-2">
                                <Slider
                                  value={[selectedItem?.amount || 1]}
                                  min={1}
                                  max={item.maxQuantity || 100}
                                  step={1}
                                  draggable
                                  onValueChange={(value) =>
                                    handleAmountChange(item?.id, value[0])
                                  }
                                  className="flex-grow"
                                />
                                <Input
                                  type="number"
                                  value={selectedItem?.amount || 1}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    if (
                                      value < 1 ||
                                      value >= (item?.maxQuantity || 100)
                                    ) {
                                      return;
                                    }
                                    handleAmountChange(item?.id, value);
                                  }}
                                  min={1}
                                  max={item.maxQuantity || 100}
                                  className="w-20"
                                />
                              </div>
                              <span className="text-sm text-gray-500 mt-1 block">
                                {item.unit}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="py-4">
          {!isLoading && (
            <div
              className={cn(
                "flex flex-wrap gap-2 mb-4 border-t border-b border-border/50  border-dashed py-6 items-center transition-all duration-500 min-h-[82px]",
                {
                  "opacity-0": selectedItems.length === 0,
                  "opacity-1": selectedItems.length > 0,
                }
              )}
            >
              <h4 className="font-semibold text-primary mr-2">
                Your commitments:
              </h4>
              {selectedItems.map((item, index) => (
                <Button
                  key={index}
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="bg-accent rounded-none text-sm"
                  variant={"outline"}
                >
                  {item.name} ({item.amount} {item.unit})
                  <XIcon className="ml-2 w-5 inline" />
                </Button>
              ))}
            </div>
          )}

          <div className="flex flex-row gap-4 max-w-md mx-auto">
            <Button
              disabled={phase === 0 ? !canGoBack() : false}
              onClick={phase === 0 ? goBack : handlePrevPhase}
              variant="outline"
            >
              Go back
            </Button>

            <Button
              disabled={
                phase === filteredPhases?.length - 1
                  ? selectedItems?.length === 0 || !canGoNext()
                  : false
              }
              loading={isLoading}
              className="ml-auto flex-1"
              onClick={
                phase === filteredPhases?.length - 1 ? goNext : handleNextPhase
              }
            >
              {phase === filteredPhases?.length - 1
                ? "Finish Selection"
                : "Next items"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
