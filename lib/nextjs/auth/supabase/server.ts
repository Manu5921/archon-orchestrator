import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type {
  AuthCredentials,
  SignUpCredentials,
  AuthResponse,
  PasswordResetRequest,
  User,
} from './types';

/**
 * Create Supabase server client
 * Uses @supabase/ssr for automatic cookie handling
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Cookie setting can fail during render
            // This is expected and safe to ignore
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Cookie removal can fail during render
            // This is expected and safe to ignore
          }
        },
      },
    }
  );
}

/**
 * Sign in with email and password
 */
export async function signIn(credentials: AuthCredentials): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return {
      user: null,
      error: {
        message: error.message,
        status: error.status,
      },
    };
  }

  return {
    user: data.user,
    error: null,
  };
}

/**
 * Sign up with email and password
 */
export async function signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: credentials.metadata || {},
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      user: null,
      error: {
        message: error.message,
        status: error.status,
      },
    };
  }

  return {
    user: data.user,
    error: null,
  };
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/**
 * Send password reset email
 */
export async function resetPassword(request: PasswordResetRequest): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(request.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    return {
      user: null,
      error: {
        message: error.message,
        status: error.status,
      },
    };
  }

  return {
    user: null,
    error: null,
  };
}

/**
 * Update user password (after reset)
 */
export async function updatePassword(newPassword: string): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      user: null,
      error: {
        message: error.message,
        status: error.status,
      },
    };
  }

  return {
    user: data.user,
    error: null,
  };
}

/**
 * Get current user (server-side)
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Get current session (server-side)
 */
export async function getSession() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return user !== null;
}

/**
 * Require authentication (redirect to sign-in if not authenticated)
 */
export async function requireAuth(redirectTo: string = '/sign-in'): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}
