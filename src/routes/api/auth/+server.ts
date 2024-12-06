import { json } from '@sveltejs/kit';
import { _supabase } from '$lib/server/+server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        const { data: { session }, error } = await _supabase.auth.getSession();

        if (error) {
            return json({ error: error.message }, { status: 400 });
        }

        return json({ session });
    } catch (error) {
        console.error('Session error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, password, action } = await request.json();

        if (!email || !password) {
            return json({ error: 'Email and password are required' }, { status: 400 });
        }

        let authResponse;

        if (action === 'signup') {
            authResponse = await _supabase.auth.signUp({
                email,
                password,
                phone: '+27123456789',
                options: {
                    emailRedirectTo: `${request.headers.get('origin')}/admin`,
                    data: {
                        first_name: 'John',
                        last_name: 'Doe'
                    }
                }
            });
        } else {
            authResponse = await _supabase.auth.signInWithPassword({
                email,
                password
            });
        }

        const { data, error } = authResponse;

        if (error) {
            return json({ error: error.message }, { status: 400 });
        }

        return json({ data });
    } catch (error) {
        console.error('Auth error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};