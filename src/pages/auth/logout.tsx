import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@cn";
import { useLogout } from "@/lib/client/helpers/hooks/auth.hooks";
import AuthLayout from "@/components/common/Layout/AuthLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function Logout() {
  const { loading, logout, error, success } = useLogout();
  const router = useRouter();

  useEffect(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    if (success) {
      router.push("/");
    }
  }, [success, router]);

  return (
    <AuthLayout>
      <Card
        className={cn("w-full max-w-96", {
          "border-destructive": error,
        })}
      >
        <CardHeader>
          <CardTitle>
            {success
              ? "You have been logged out. You'll be automatically redirected to the home page in 5 seconds."
              : "Logging you out..."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <LoadingSpinner className="h-full" />}
          {error && (
            <CardDescription className="text-destructive text-base">
              An error occurred while logging out. Please try again.
            </CardDescription>
          )}
        </CardContent>
        {success && (
          <CardFooter className="flex flex-col gap-4">
            <Link href="/" className="w-full">
              <Button variant={"outline"} disabled={loading} className="w-full">
                Go to home page
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full">
              <Button disabled={loading} className="w-full">
                Login
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </AuthLayout>
  );
}
