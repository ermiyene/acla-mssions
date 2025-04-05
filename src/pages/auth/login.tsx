import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/lib/client/helpers/hooks/auth.hooks";
import AuthLayout from "@/components/common/Layout/AuthLayout";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { login, loading, error } = useLogin();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      router.push("/admin");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthLayout>
      <Card
        className={cn("w-full max-w-96", {
          "border-destructive": error,
        })}
      >
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form
              id="login-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="kalkidan@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="*******"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            disabled={loading}
            loading={loading}
            className="w-full"
            form="login-form"
            type="submit"
          >
            Login
          </Button>
          {error && (
            <CardDescription className="text-destructive text-base">
              {error}
            </CardDescription>
          )}
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
