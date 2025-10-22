'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from './client';
import type { User, Session, SessionContextValue } from './types';

/**
 * Auth context
 */
const AuthContext = createContext<SessionContextValue | undefined>(undefined);

/**
 * AuthProvider - Wrap your app with this provider
 *
 * @example
 * // app/layout.tsx
 * import { AuthProvider } from '@/lib/auth/providers';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>
 *           {children}
 *         </AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setError({ message: error.message });
        setLoading(false);
        return;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: SessionContextValue = {
    user,
    session,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuthContext hook - Access auth context
 *
 * @example
 * const { user, session, loading } = useAuthContext();
 */
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}
