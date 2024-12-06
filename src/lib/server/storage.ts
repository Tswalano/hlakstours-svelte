// src/lib/server/storage.ts
import type { TripImage } from '$lib/types/trip';
import { _supabase } from './+server';

export async function uploadToSupabase(
    file: File,
    bucket: string = 'uploads',
    folder: string = ''
): Promise<TripImage> {
    try {
        // Create unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        const { data, error } = await _supabase.storage.from(bucket).upload(`${filePath}`, file, {
            cacheControl: '3600',
            upsert: false
        })

        if (error) {
            console.error('Error uploading to Supabase:', error);
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = _supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        console.log('File uploaded to Supabase:', data.path, publicUrl);

        return {
            path: data.path,
            fullUrl: publicUrl
        };
    } catch (error) {
        console.error('Error uploading to Supabase:', error);
        throw error;
    }
}

export async function deleteFromSupabase(
    path: string,
    bucket: string = 'trips'
): Promise<void> {
    try {
        const { error } = await _supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error deleting from Supabase:', error);
        throw error;
    }
}