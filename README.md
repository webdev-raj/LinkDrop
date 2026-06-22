# LinkDrop

Free link-in-bio builder. No account, no backend database.
Page data lives in a compressed URL hash — backgrounds upload to Cloudinary so links stay short.

## Run locally

```bash
npm install
cp .env.example .env   # then fill in Cloudinary keys
npm start
```

## Cloudinary setup (background uploads)

Background GIFs/images upload to Cloudinary instead of being embedded in the URL (which made links enormous).

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. **Settings → Upload → Add upload preset**
3. Set **Signing mode** to **Unsigned**
4. Copy your **Cloud name** and **Upload preset name** into `.env`:

```
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

5. Restart `npm start`

On Vercel, add the same two variables under Project → Settings → Environment Variables.

## Deploy to Vercel

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add the Cloudinary env vars above
4. Deploy

## How the URL works

When you click **Generate my link**, profile + links are compressed (lz-string) with short keys and stored in the hash:

```
yoursite.vercel.app/p#2.N4IgbghgDg...
```

- **v2 format** (`2.` prefix) — compact + compressed (~200–800 chars typical)
- **Legacy format** — old base64 links still work
- **Background media** — only the Cloudinary URL is stored (~80 chars), not the image itself

The `/p` page decodes the hash and renders your profile. No server database. Free forever.
