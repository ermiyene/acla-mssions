import React from "react";
import Navbar from "./Navbar";
import { WalletIcon } from "@heroicons/react/24/outline";
import MobileNavMenu from "./MobileNavMenu";
import {
  BadgePlus,
  Blocks,
  CreditCard,
  FileText,
  Gift,
  WrenchIcon,
} from "lucide-react";

export const navigation = [
  {
    name: "Pledges",
    href: "/admin",
    icon: FileText,
  },
  {
    name: "Banks",
    href: "/admin/banks",
    icon: CreditCard,
  },
  {
    name: "In Kind Items",
    href: "/admin/in-kind",
    icon: Blocks,
  },
  // {
  //   name: "Settings",
  //   href: "/admin/expenses",
  //   icon: WrenchIcon,
  // },
];

export default function AdminNavbar() {
  return (
    <>
      <Navbar items={navigation} />
      <MobileNavMenu items={navigation} />
    </>
  );
}
