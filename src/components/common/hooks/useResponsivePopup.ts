import { useMediaQuery } from "react-responsive";
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "../../../components/ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

export function useResponsivePopup() {
  const isDesktop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  if (isDesktop) {
    return {
      Popup: Dialog,
      PopupPortal: DialogPortal,
      PopupOverlay: DialogOverlay,
      PopupTrigger: DialogTrigger,
      PopupClose: DialogClose,
      PopupContent: DialogContent,
      PopupHeader: DialogHeader,
      PopupFooter: DialogFooter,
      PopupTitle: DialogTitle,
      PopupDescription: DialogDescription,
    };
  }

  return {
    Popup: Drawer,
    PopupPortal: DrawerPortal,
    PopupOverlay: DrawerOverlay,
    PopupTrigger: DrawerTrigger,
    PopupClose: DrawerClose,
    PopupContent: DrawerContent,
    PopupHeader: DrawerHeader,
    PopupFooter: DrawerFooter,
    PopupTitle: DrawerTitle,
    PopupDescription: DrawerDescription,
  };
}
