const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export function isCloudinaryConfigured() {
  return Boolean(
    CLOUD_NAME &&
    CLOUD_NAME !== 'REPLACE_WITH_YOUR_CLOUD_NAME' &&
    UPLOAD_PRESET &&
    UPLOAD_PRESET !== 'your_unsigned_preset'
  );
}

export async function uploadToCloudinary(file) {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Add REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET to your .env file.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Upload failed. Check your Cloudinary preset.');
  }

  const data = await response.json();
  return data.secure_url;
}

/** Optimized delivery URL for page backgrounds (auto format/quality). */
export function cloudinaryBackgroundUrl(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}

/** Optimized delivery URL for profile avatars (resize to 200x200, face crop, auto format/quality). */
export function cloudinaryAvatarUrl(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  return url.replace('/upload/', '/upload/w_200,h_200,c_fill,g_face,f_auto,q_auto/');
}
