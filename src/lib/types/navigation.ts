// src/lib/types/index.ts
import type { ComponentType } from 'svelte';
import type { User as SupabaseUser } from '@supabase/auth-js';

export interface NavigationItem {
    label: string;
    icon: ComponentType;
    href: string;
    match: RegExp;
}

export interface StatItem {
    title: string;
    value: string;
    change: string;
    icon: ComponentType;
    color: string;
}

export interface User extends SupabaseUser {
    id: string;
    email: string;
    user_metadata: {
        full_name?: string;
        avatar_url?: string;
    };
}