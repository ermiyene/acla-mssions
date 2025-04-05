import React from "react";
import { useGetCurrentUser } from "@/lib/client/helpers/hooks/auth.hooks";
import { useRouter } from "next/router";
import CashierNavbar from "../Navbar/CashierNavbar";

interface CashierLayoutProps {
  children: React.ReactNode;
}
export default function CashierLayout({ children }: CashierLayoutProps) {
  const router = useRouter();

  useGetCurrentUser({
    onError: () => {
      router.push("/auth/login");
    },
  });

  return (
    <div className={"max-sm:pb-18 h-full"}>
      <CashierNavbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </div>
    </div>
  );
}
