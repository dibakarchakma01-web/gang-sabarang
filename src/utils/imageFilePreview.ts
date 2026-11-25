const MAX_IMAGE_FILE_BYTES = 8 * 1024 * 1024;

/**
 * Converts a browser-selected image File into a local Data URL preview.
 * Structured so Phase 9 can replace or wrap this with Supabase Storage upload.
 */
export function readImageFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (PNG, JPG, or WebP).'));
      return;
    }

    if (file.size > MAX_IMAGE_FILE_BYTES) {
      reject(new Error('Image file must be 8 MB or smaller for local preview.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string' && reader.result.startsWith('data:image/')) {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read the selected image file.'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to load the selected image file.'));
    };
    reader.readAsDataURL(file);
  });
}
