import { useState } from "react";
import { useResponsivePopup } from "./hooks/useResponsivePopup";

interface Option {
  close: () => void;
}

interface LPopupProps {
  title: string;
  trigger: React.ReactNode | ((options: Option) => React.ReactNode);
  children: React.ReactNode | ((options: Option) => React.ReactNode);
  footer: React.ReactNode | ((options: Option) => React.ReactNode);
  onOpenChange?: () => void;
}

export function LPopup({
  title,
  trigger,
  children,
  footer,
  onOpenChange,
}: LPopupProps) {
  const [open, setOpen] = useState(false);
  const {
    Popup,
    PopupContent,
    PopupFooter,
    PopupHeader,
    PopupTitle,
    PopupTrigger,
  } = useResponsivePopup();

  function optionHandler(
    content: React.ReactNode | ((options: Option) => React.ReactNode)
  ) {
    if (typeof content === "function") {
      return content({
        close: () => setOpen(false),
      });
    }
    return content;
  }

  function handleOpenChange(open: boolean) {
    onOpenChange?.();
    setOpen(open);
  }

  return (
    <Popup open={open} onOpenChange={handleOpenChange}>
      <PopupTrigger asChild>{optionHandler(trigger)}</PopupTrigger>
      <PopupContent className="p-0 gap-0 !rounded-lg">
        <div className="mx-auto w-full">
          <PopupHeader className="border-b p-6">
            <div className="w-full max-md:max-w-sm mx-auto">
              <PopupTitle>{title}</PopupTitle>
            </div>
          </PopupHeader>
          {optionHandler(children)}
          <PopupFooter className="px-6 py-4 border-t max-sm:pb-8">
            <div className="w-full max-md:max-w-sm mx-auto">
              {optionHandler(footer)}
            </div>
          </PopupFooter>
        </div>
      </PopupContent>
    </Popup>
  );
}
