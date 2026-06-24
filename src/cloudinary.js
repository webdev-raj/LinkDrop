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
    const cloudinaryMsg = err.error?.message || '';

    // Surface Cloudinary preset size limit issues clearly
    if (cloudinaryMsg.toLowerCase().includes('file size') || cloudinaryMsg.toLowerCase().includes('too large')) {
      throw new Error(
        `File too large for your Cloudinary preset. Go to Cloudinary Dashboard → Upload Presets → "${UPLOAD_PRESET}" and increase or remove the "Max file size" limit.`
      );
    }

    throw new Error(cloudinaryMsg || 'Upload failed. Check your Cloudinary preset settings.');
  }

  const data = await response.json();
  return data.secure_url;
}

/** Check if a Cloudinary URL points to a GIF (by extension or resource_type). */
function isGifUrl(url) {
  // Check the public_id part of the URL for a .gif extension
  return url && /\.gif($|\?)/i.test(url);
}

/** Optimized delivery URL for page backgrounds.
 *  GIFs skip f_auto because Cloudinary converts them to static WebP, killing animation.
 *  Non-GIFs get f_auto,q_auto for best format/size tradeoff.
 */
export function cloudinaryBackgroundUrl(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  // Never reformat GIFs — f_auto would strip the animation
  if (isGifUrl(url)) {
    return url.replace('/upload/', '/upload/q_auto:low/');
  }

  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}

/** Optimized delivery URL for profile avatars (resize to 200x200, face crop, auto format/quality).
 *  GIFs skip f_auto and face crop to preserve animation.
 */
export function cloudinaryAvatarUrl(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  // Preserve GIF animation — skip f_auto and g_face which don't work on animated GIFs
  if (isGifUrl(url)) {
    return url.replace('/upload/', '/upload/w_200,h_200,c_fill,q_auto:low/');
  }

  return url.replace('/upload/', '/upload/w_200,h_200,c_fill,g_face,f_auto,q_auto/');
}
