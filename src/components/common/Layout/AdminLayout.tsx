import React from "react";
import { useGetCurrentUser } from "@/lib/client/helpers/hooks/auth.hooks";
import { useRouter } from "next/router";
import AdminNavbar from "../Navbar/AdminNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}
export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  useGetCurrentUser({
    onError: () => {
      router.push("/");
    },
  });

  return (
    <div className={"max-sm:pb-18 h-full"}>
      <AdminNavbar />
      <div className="mx-auto max-w-7xl md:px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {children}
      </div>
    </div>
  );
}
