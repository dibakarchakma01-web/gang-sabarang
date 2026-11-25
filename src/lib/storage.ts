import { SUPABASE_MEDIA_BUCKET, supabase } from './supabase';
import {
  buildSafeStoragePath,
  validateUploadImageFile,
  type MediaUploadFolder,
} from '../utils/storagePath';

export type { MediaUploadFolder };

export async function uploadMediaFile(
  file: File,
  folder: MediaUploadFolder,
): Promise<string> {
  const validation = validateUploadImageFile(file);
  if (!validation.ok) {
    throw new Error(validation.error ?? 'Invalid image file.');
  }

  const filePath = buildSafeStoragePath(folder, file.name);

  const { data, error } = await supabase.storage
    .from(SUPABASE_MEDIA_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error || !data?.path) {
    throw new Error(
      `Supabase Storage upload error in bucket "${SUPABASE_MEDIA_BUCKET}": ${
        error?.message || 'Unknown upload failure'
      }`,
    );
  }

  const { data: publicData } = supabase.storage
    .from(SUPABASE_MEDIA_BUCKET)
    .getPublicUrl(data.path);

  if (!publicData?.publicUrl) {
    throw new Error('Image uploaded, but no public URL was returned.');
  }

  return publicData.publicUrl;
}
