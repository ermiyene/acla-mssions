import Link from "next/link";
import Image from "next/image";
import React, { useEffect } from "react";
import Navbar from "@/components/features/LandingPage/Hero/Navbar";
import { useAuthStore } from "@/lib/client/store/authStore";
import { useGetCurrentUser } from "@/lib/client/helpers/hooks/auth.hooks";
import { useRouter } from "next/router";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  useGetCurrentUser();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }
    router.push("/admin");
  }, [currentUser, router]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-full w-full flex flex-col justify-center items-center gap-12 p-4 bg-accent/10">
        {children}
      </div>
    </div>
  );
}
