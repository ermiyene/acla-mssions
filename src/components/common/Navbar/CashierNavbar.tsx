import React from "react";
import Navbar from "./Navbar";
import {
  ShoppingCartIcon,
  WalletIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { ReaderIcon } from "@radix-ui/react-icons";
import MobileNavMenu from "./MobileNavMenu";

export const navigation = [
  {
    name: "Sales",
    href: "/cashier",
    icon: ShoppingCartIcon,
  },
  {
    name: "Expenses",
    href: "/cashier/expenses",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Reports",
    href: "/cashier/reports",
    icon: ReaderIcon,
  },
  {
    name: "Funds",
    href: "/cashier/funds",
    icon: WalletIcon,
  },
];

export default function CashierNavbar() {
  return (
    <>
      <Navbar items={navigation} />
      <MobileNavMenu items={navigation} />
    </>
  );
}
