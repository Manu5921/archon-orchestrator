/**
 * Supabase Auth Module for Next.js 15
 * @module lib/nextjs/auth/supabase
 */

// Server exports
export {
  createClient as createServerClient,
  signIn,
  signUp,
  signOut,
  resetPassword,
  updatePassword,
  getUser,
  getSession,
  isAuthenticated,
  requireAuth,
} from './server';

// Client exports
export {
  createClient as createBrowserClient,
  useUser,
  useSession,
  useAuth,
} from './client';

// Provider exports
export { AuthProvider, useAuthContext } from './providers';

// Middleware exports
export { authMiddleware, config } from './middleware';

// Type exports
export type {
  User,
  Session,
  AuthCredentials,
  SignUpCredentials,
  AuthResponse,
  AuthError,
  UserMetadata,
  PasswordResetRequest,
  SessionContextValue,
} from './types';
