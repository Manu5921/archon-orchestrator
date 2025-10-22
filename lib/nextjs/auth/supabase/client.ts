'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import type { User, Session, AuthError } from './types';

/**
 * Create Supabase browser client
 * Singleton pattern - reuse same client instance
 */
let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) {
    return client;
  }

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}

/**
 * useUser hook - Get current user
 *
 * @example
 * const { user, loading, error } = useUser();
 *
 * if (loading) return <div>Loading...</div>;
 * if (!user) return <div>Not authenticated</div>;
 *
 * return <div>Hello {user.email}</div>;
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        setError({ message: error.message, status: error.status });
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}

/**
 * useSession hook - Get current session
 *
 * @example
 * const { session, loading } = useSession();
 *
 * if (loading) return <div>Loading...</div>;
 * if (!session) return <div>Not authenticated</div>;
 *
 * return <div>Session expires: {session.expires_at}</div>;
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setError({ message: error.message, status: error.status });
      } else {
        setSession(data.session);
      }
      setLoading(false);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading, error };
}

/**
 * useAuth hook - Get both user and session
 *
 * @example
 * const { user, session, loading, error } = useAuth();
 */
export function useAuth() {
  const { user, loading: userLoading, error: userError } = useUser();
  const { session, loading: sessionLoading } = useSession();

  return {
    user,
    session,
    loading: userLoading || sessionLoading,
    error: userError,
  };
}
