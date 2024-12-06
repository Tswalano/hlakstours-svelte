// src/routes/api/upload/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadToSupabase, deleteFromSupabase } from '$lib/server/storage';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || '';

        if (!file) {
            return json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return json(
                { error: 'File must be an image' },
                { status: 400 }
            );
        }

        // Validate file size (5MB limit)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return json(
                { error: 'File size must be less than 5MB' },
                { status: 400 }
            );
        }

        const result = await uploadToSupabase(file, 'uploads', folder);
        return json(result);
    } catch (error) {
        console.error('Upload error:', error);
        return json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
};

export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const { path } = await request.json();

        if (!path) {
            return json(
                { error: 'No file path provided' },
                { status: 400 }
            );
        }

        await deleteFromSupabase(path);
        return json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    }
};