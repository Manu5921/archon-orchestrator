import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

/**
 * Re-export Supabase types for convenience
 */
export type User = SupabaseUser;
export type Session = SupabaseSession;

/**
 * Auth credentials for sign-in/sign-up
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Auth response from Server Actions
 */
export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

/**
 * Auth error type
 */
export interface AuthError {
  message: string;
  status?: number;
}

/**
 * User metadata (optional profile data)
 */
export interface UserMetadata {
  name?: string;
  avatar_url?: string;
  [key: string]: any;
}

/**
 * Sign-up credentials with optional metadata
 */
export interface SignUpCredentials extends AuthCredentials {
  metadata?: UserMetadata;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Session context value (for AuthProvider)
 */
export interface SessionContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}
