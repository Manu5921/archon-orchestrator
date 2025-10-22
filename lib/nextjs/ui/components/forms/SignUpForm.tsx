"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2Icon, CheckCircle2Icon } from "lucide-react";

import { Button } from "@/lib/nextjs/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/nextjs/ui/components/ui/form";
import { Input } from "@/lib/nextjs/ui/components/ui/input";

/**
 * Zod schema for sign-up form validation
 */
const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export interface SignUpFormProps {
  /**
   * Server Action to handle sign-up
   * Should accept { email: string; password: string }
   * Example: import { signUp } from '@/lib/nextjs/auth/supabase/server'
   */
  onSubmit: (values: {
    email: string;
    password: string;
  }) => Promise<{ error?: string | null }>;

  /**
   * Callback after successful sign-up
   */
  onSuccess?: () => void;

  /**
   * Custom submit button text
   * @default "Create Account"
   */
  submitText?: string;

  /**
   * Show loading state
   */
  isLoading?: boolean;

  /**
   * Show success message after registration
   * @default "Check your email to verify your account"
   */
  successMessage?: string;
}

/**
 * Sign-Up Form Component
 *
 * Integrates with lib/nextjs/auth/supabase for user registration.
 * Includes password strength validation and confirmation matching.
 *
 * @example
 * ```tsx
 * // app/(auth)/sign-up/page.tsx
 * import { SignUpForm } from '@/lib/nextjs/ui/components/forms/SignUpForm';
 * import { signUp } from '@/lib/nextjs/auth/supabase/server';
 *
 * export default function SignUpPage() {
 *   async function handleSignUp(values: { email: string; password: string }) {
 *     'use server';
 *     const { error } = await signUp(values);
 *     if (error) return { error: error.message };
 *     return { error: null };
 *   }
 *
 *   return <SignUpForm onSubmit={handleSignUp} />;
 * }
 * ```
 */
export function SignUpForm({
  onSubmit,
  onSuccess,
  submitText = "Create Account",
  isLoading = false,
  successMessage = "Check your email to verify your account",
}: SignUpFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: SignUpFormValues) => {
    startTransition(async () => {
      setError(null);
      setSuccess(false);

      try {
        const result = await onSubmit({
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          setError(result.error);
          return;
        }

        // Success
        setSuccess(true);
        form.reset();
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
        data-testid="sign-up-form"
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
                  autoComplete="new-password"
                  disabled={isPending || isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Must be 8+ characters with uppercase, lowercase, and number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
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

        {/* Success Message */}
        {success && (
          <div
            className="text-success flex items-center gap-2 rounded-md border border-success/50 bg-success/10 p-3 text-sm"
            role="status"
          >
            <CheckCircle2Icon className="size-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || isLoading || success}
        >
          {isPending || isLoading ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            submitText
          )}
        </Button>
      </form>
    </Form>
  );
}
