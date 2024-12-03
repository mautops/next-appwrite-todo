"use client";
import { useForm, FormProvider } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import { LoginSchema } from "@/schemas/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EmailLogin } from "@/app/auth/login/actions";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";

export default function LoginForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "peizhenfei@cvte.com",
      password: "adminpwd",
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      EmailLogin(data).then((res) => {
        if (res.message) {
          toast({
            title: "Login Info",
            description: res.message,
          });
        }
        if (res.redirect) {
          redirect(res.redirect);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocialLogin={true}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="peizhenfei@cvte.com"
                    disabled={isPending}
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="12345678"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            Login
          </Button>
        </form>
      </FormProvider>
    </CardWrapper>
  );
}
