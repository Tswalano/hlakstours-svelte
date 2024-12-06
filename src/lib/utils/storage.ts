// // src/lib/utils/storage.ts
// import { _supabase } from '$lib/server/+server';
// import type { TripImage } from '$lib/types/trip';

// export async function uploadImageToSupabase(
//     file: File,
//     bucket: string = 'trips',
//     folder: string = ''
// ): Promise<TripImage> {
//     try {
//         // Create unique file name
//         const fileExt = file.name.split('.').pop();
//         const fileName = `${crypto.randomUUID()}.${fileExt}`;
//         const filePath = folder ? `${folder}/${fileName}` : fileName;

//         // Upload file to Supabase
//         const { data, error } = await _supabase.storage
//             .from(bucket)
//             .upload(filePath, file, {
//                 cacheControl: '3600',
//                 upsert: false
//             });

//         if (error) {
//             throw error;
//         }

//         // Get public URL
//         const { data: { publicUrl } } = _supabase.storage
//             .from(bucket)
//             .getPublicUrl(data.path);

//         return {
//             path: data.path,
//             fullUrl: publicUrl
//         };
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         throw error;
//     }
// }

// export async function deleteImageFromSupabase(
//     path: string,
//     bucket: string = 'trips'
// ): Promise<void> {
//     try {
//         const { error } = await _supabase.storage
//             .from(bucket)
//             .remove([path]);

//         if (error) {
//             throw error;
//         }
//     } catch (error) {
//         console.error('Error deleting image:', error);
//         throw error;
//     }
// }

// export function sanitizeFileName(name: string): string {
//     return name.toLowerCase()
//         .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
//         .replace(/-+/g, '-')        // Replace multiple hyphens with single hyphen
//         .replace(/^-|-$/g, '');     // Remove leading/trailing hyphens
// }