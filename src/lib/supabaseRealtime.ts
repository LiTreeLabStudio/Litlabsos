// Homebase-3.0: Supabase Table Subscriptions Example
// Place in frontend/src/lib/supabaseRealtime.ts

import { supabase } from './supabaseClient';

export function subscribeToLogs(sessionId: string, onLog: (log: unknown) => void) {
  if (!supabase) return { unsubscribe: () => {}, unsubscribeChannel: () => {} };
  return supabase
    .channel('public:logs')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'logs', filter: `session_id=eq.${sessionId}` },
      (payload) => {
        onLog(payload.new);
      }
    )
    .subscribe();
}

// Usage in a React component:
// useEffect(() => {
//   const sub = subscribeToLogs(sessionId, (log) => setLogs((prev) => [...prev, log]));
//   return () => { sub.unsubscribe(); };
// }, [sessionId]);
