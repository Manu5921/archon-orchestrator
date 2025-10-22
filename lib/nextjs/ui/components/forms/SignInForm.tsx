"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/lib/nextjs/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/nextjs/ui/components/ui/form";
import { Input } from "@/lib/nextjs/ui/components/ui/input";

/**
 * Zod schema for sign-in form validation
 */
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export interface SignInFormProps {
  /**
   * Server Action to handle sign-in
   * Should accept { email: string; password: string }
   * Example: import { signIn } from '@/lib/nextjs/auth/supabase/server'
   */
  onSubmit: (values: SignInFormValues) => Promise<{ error?: string | null }>;

  /**
   * Callback after successful sign-in
   */
  onSuccess?: () => void;

  /**
   * Custom submit button text
   * @default "Sign In"
   */
  submitText?: string;

  /**
   * Show loading state
   */
  isLoading?: boolean;
}

/**
 * Sign-In Form Component
 *
 * Integrates with lib/nextjs/auth/supabase for authentication.
 *
 * @example
 * ```tsx
 * // app/(auth)/sign-in/page.tsx
 * import { SignInForm } from '@/lib/nextjs/ui/components/forms/SignInForm';
 * import { signIn } from '@/lib/nextjs/auth/supabase/server';
 * import { redirect } from 'next/navigation';
 *
 * export default function SignInPage() {
 *   async function handleSignIn(values: { email: string; password: string }) {
 *     'use server';
 *     const { error } = await signIn(values);
 *     if (error) return { error: error.message };
 *     redirect('/dashboard');
 *   }
 *
 *   return <SignInForm onSubmit={handleSignIn} />;
 * }
 * ```
 */
export function SignInForm({
  onSubmit,
  onSuccess,
  submitText = "Sign In",
  isLoading = false,
}: SignInFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: SignInFormValues) => {
    startTransition(async () => {
      setError(null);

      try {
        const result = await onSubmit(values);

        if (result?.error) {
          setError(result.error);
          return;
        }

        // Success callback
        onSuccess?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        data-testid="sign-in-form"
      >
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isPending || isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isPending || isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error Message */}
        {error && (
          <div
            className="text-destructive rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || isLoading}
        >
          {isPending || isLoading ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            submitText
          )}
        </Button>
      </form>
    </Form>
  );
}
