"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2Icon, CheckCircle2Icon, MailIcon } from "lucide-react";

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
 * Zod schema for password reset request
 */
const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export interface ResetPasswordFormProps {
  /**
   * Server Action to handle password reset request
   * Should accept { email: string }
   * Example: import { resetPassword } from '@/lib/nextjs/auth/supabase/server'
   */
  onSubmit: (values: ResetPasswordFormValues) => Promise<{
    error?: string | null;
  }>;

  /**
   * Callback after successful reset request
   */
  onSuccess?: () => void;

  /**
   * Custom submit button text
   * @default "Send Reset Email"
   */
  submitText?: string;

  /**
   * Show loading state
   */
  isLoading?: boolean;

  /**
   * Custom success message
   * @default "Check your email for a password reset link"
   */
  successMessage?: string;
}

/**
 * Password Reset Form Component
 *
 * Integrates with lib/nextjs/auth/supabase for password reset flow.
 * Sends password reset email to user's registered email address.
 *
 * @example
 * ```tsx
 * // app/(auth)/reset-password/page.tsx
 * import { ResetPasswordForm } from '@/lib/nextjs/ui/components/forms/ResetPasswordForm';
 * import { resetPassword } from '@/lib/nextjs/auth/supabase/server';
 *
 * export default function ResetPasswordPage() {
 *   async function handleResetPassword(values: { email: string }) {
 *     'use server';
 *     const { error } = await resetPassword(values);
 *     if (error) return { error: error.message };
 *     return { error: null };
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Reset Password</h1>
 *       <ResetPasswordForm onSubmit={handleResetPassword} />
 *     </div>
 *   );
 * }
 * ```
 */
export function ResetPasswordForm({
  onSubmit,
  onSuccess,
  submitText = "Send Reset Email",
  isLoading = false,
  successMessage = "Check your email for a password reset link",
}: ResetPasswordFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (values: ResetPasswordFormValues) => {
    startTransition(async () => {
      setError(null);
      setSuccess(false);

      try {
        const result = await onSubmit(values);

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

  const handleTryAgain = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        data-testid="reset-password-form"
      >
        {!success ? (
          <>
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
                  <FormDescription>
                    Enter the email address associated with your account
                  </FormDescription>
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
                  Sending email...
                </>
              ) : (
                <>
                  <MailIcon className="mr-2 size-4" />
                  {submitText}
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div
              className="text-success flex flex-col items-center gap-4 rounded-md border border-success/50 bg-success/10 p-6 text-center"
              role="status"
            >
              <CheckCircle2Icon className="size-12 shrink-0" />
              <div className="space-y-2">
                <p className="font-medium">{successMessage}</p>
                <p className="text-muted-foreground text-sm">
                  If an account exists with that email, you'll receive a
                  password reset link shortly.
                </p>
              </div>
            </div>

            {/* Try Again Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleTryAgain}
            >
              Send to a different email
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
