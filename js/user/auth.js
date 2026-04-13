/**
 * User Authentication Service
 * All Supabase Auth API calls
 */

import { getSupabase } from '../services/supabase.js';

// ─── OAuth ────────────────────────────────────────
export async function signInWithGitHub() {
  // Build redirect URL to auth page (handles session → dashboard redirect)
  const origin = window.location.origin;
  const basePath = window.location.pathname.replace(/\/[^/]*$/, '');
  const redirectTo = `${origin}${basePath}/../auth/user.html`;

  const { data, error } = await getSupabase().auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo }
  });
  if (error) throw error;
  return data;
}

// ─── Email / Password ─────────────────────────────
export async function signUpWithEmail(email, password) {
  const { data, error } = await getSupabase().auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email, password) {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// ─── Session ──────────────────────────────────────
export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session }, error } = await getSupabase().auth.getSession();
  if (error) throw error;
  return session;
}

export function onAuthStateChange(callback) {
  const { data: { subscription } } = getSupabase().auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return subscription;
}
