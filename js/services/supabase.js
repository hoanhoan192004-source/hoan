/**
 * Supabase Service
 * Connection, Tasks CRUD, and Realtime subscription
 */

import { CONFIG, DB_CONFIG } from '../config.js';

let supabaseClient = null;

// ─── Connection ────────────────────────────────────
export function initSupabase() {
  if (supabaseClient) return supabaseClient;
  try {
    supabaseClient = window.supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.key);
    console.log('✓ Supabase initialized');
    return supabaseClient;
  } catch (error) {
    console.error('✗ Failed to initialize Supabase:', error);
    throw error;
  }
}

export function getSupabase() {
  if (!supabaseClient) throw new Error('Supabase not initialized.');
  return supabaseClient;
}

// ─── Tasks CRUD ────────────────────────────────────
export async function fetchAllTasks() {
  const { data: { session } } = await getSupabase().auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return null;
  
  const { data, error } = await getSupabase()
    .from(DB_CONFIG.table).select('*')
    .eq('user_id', userId)
    .order(DB_CONFIG.columns.createdAt, { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createTask(taskData) {
  const { data: { session } } = await getSupabase().auth.getSession();
  const userId = session?.user?.id;
  if (userId) {
    taskData.user_id = userId;
  }

  const { data, error } = await getSupabase()
    .from(DB_CONFIG.table).insert([taskData]).select();
  if (error) throw error;
  return data?.[0];
}

export async function updateTask(taskId, updates) {
  const { data: { session } } = await getSupabase().auth.getSession();
  const userId = session?.user?.id;

  let query = getSupabase().from(DB_CONFIG.table).update(updates).eq(DB_CONFIG.columns.id, taskId);
  if (userId) query = query.eq('user_id', userId);

  const { data, error } = await query.select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteTask(taskId) {
  const { data: { session } } = await getSupabase().auth.getSession();
  const userId = session?.user?.id;

  let query = getSupabase().from(DB_CONFIG.table).delete().eq(DB_CONFIG.columns.id, taskId);
  if (userId) query = query.eq('user_id', userId);

  const { error } = await query;
  if (error) throw error;
}

// ─── Realtime Subscription ────────────────────────
let activeChannel = null;

/**
 * Subscribe to real-time changes on the tasks table.
 * Handles INSERT, UPDATE, DELETE events.
 * Includes auto-reconnect and status logging.
 * @param {Function} callback - receives { eventType, new, old }
 * @returns {Object} channel subscription
 */
export async function subscribeToTaskChanges(callback) {
  // Unsubscribe previous channel if exists
  if (activeChannel) {
    unsubscribeFromTaskChanges();
  }

  const { data: { session } } = await getSupabase().auth.getSession();
  const userId = session?.user?.id;
  let filterStr = undefined;
  if(userId) {
    filterStr = `user_id=eq.${userId}`;
  }

  const channelName = `realtime:${DB_CONFIG.table}:${Date.now()}`;

  activeChannel = getSupabase()
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',           // Listen to INSERT, UPDATE, DELETE
        schema: 'public',
        table: DB_CONFIG.table,
        filter: filterStr
      },
      (payload) => {
        console.log(`⚡ Realtime [${payload.eventType}]:`, payload.new?.title || payload.old?.id);
        callback(payload);
      }
    )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log('✓ Realtime connected – listening for changes');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('✗ Realtime channel error:', err);
      } else if (status === 'CLOSED') {
        console.warn('⚠ Realtime channel closed');
      } else if (status === 'TIMED_OUT') {
        console.warn('⚠ Realtime timed out – will retry...');
      }
    });

  return activeChannel;
}

/**
 * Unsubscribe from real-time changes
 */
export function unsubscribeFromTaskChanges() {
  if (activeChannel) {
    getSupabase().removeChannel(activeChannel);
    activeChannel = null;
    console.log('✓ Realtime unsubscribed');
  }
}
