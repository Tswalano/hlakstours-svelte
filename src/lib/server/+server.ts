// src/lib/server/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import { SUPERBASE_DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

const client = postgres(SUPERBASE_DATABASE_URL);
const db = drizzle(client);


export const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default db