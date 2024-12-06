// src/lib/utils/clientStorage.ts
import type { TripImage } from '$lib/types/trip';

export async function uploadImageToStorage(
    file: File,
    folder: string = ''
): Promise<TripImage> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        if (folder) {
            formData.append('folder', folder);
        }

        console.log('Uploading image...');
        console.log(file, folder);

        const response = await fetch('/api/uploads', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

export async function deleteImageFromStorage(path: string): Promise<void> {
    try {
        const response = await fetch('/api/uploads', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path })
        });

        if (!response.ok) {
            throw new Error('Failed to delete image');
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}

export function sanitizeFileName(name: string): string {
    return name.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}