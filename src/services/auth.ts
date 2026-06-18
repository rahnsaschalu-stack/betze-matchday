import supabase from './supabase';
import { AuthError } from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  displayName: string;
}

/**
 * Register a new user with email, password, username
 */
export async function register(credentials: RegisterCredentials) {
  try {
    // Sign up with email and password
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: data.user.id,
            username: credentials.username,
            display_name: credentials.displayName,
            points: 0,
            level: 1,
          },
        ]);

      if (profileError) throw profileError;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as AuthError };
  }
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as AuthError };
  }
}

/**
 * Logout current session
 */
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as AuthError };
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    return { session, error: null };
  } catch (error) {
    return { session: null, error: error as AuthError };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
}

/**
 * Reset password with email
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'betze://auth/reset-password',
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return { error: error as AuthError };
  }
}
