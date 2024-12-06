import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { _supabase } from '$lib/server/+server';

export const POST: RequestHandler = async () => {
  try {
    const { error } = await _supabase.auth.signOut();

    if (error) {
      return json({ error: error.message }, { status: 400 });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};